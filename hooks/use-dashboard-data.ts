"use client"

import { useState, useEffect } from "react"
import { supabase, testSupabaseConnection } from "@/lib/supabase"

export interface DashboardStats {
  totalMalls: number
  totalShops: number
  totalBookings: number
  totalRevenue: number
  recentInquiries: number
  activeUsers: number
  occupancyRate: number
  monthlyGrowth: number
}

export interface RecentActivity {
  id: number
  user: string
  action: string
  target: string
  time: string
  avatar: string
  type: string
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMalls: 0,
    totalShops: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentInquiries: 0,
    activeUsers: 0,
    occupancyRate: 0,
    monthlyGrowth: 0,
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      console.log("Fetching dashboard stats...")
      
      // Test connection first
      const connectionTest = await testSupabaseConnection()
      if (!connectionTest.success) {
        throw new Error(`Database connection failed: ${connectionTest.error}`)
      }

      const [mallsResult, shopsResult, bookingsResult, inquiriesResult, usersResult] = await Promise.all([
        supabase.from("malls").select("id", { count: "exact" }).limit(1),
        supabase.from("shops").select("id, status", { count: "exact" }).limit(100),
        supabase.from("bookings").select("id, total_amount", { count: "exact" }).limit(100),
        supabase
          .from("inquiries")
          .select("id")
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .limit(50),
        supabase.from("users").select("id").eq("is_active", true).limit(100),
      ])

      // Check for errors in any of the queries
      const errors = [mallsResult.error, shopsResult.error, bookingsResult.error, inquiriesResult.error, usersResult.error].filter(Boolean)
      if (errors.length > 0) {
        console.error("Database query errors:", errors)
        throw new Error(`Database query failed: ${errors[0]?.message}`)
      }

      const totalRevenue = bookingsResult.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
      const rentedShops = shopsResult.data?.filter((shop) => shop.status === "rented").length || 0
      const occupancyRate = shopsResult.count ? Math.round((rentedShops / shopsResult.count) * 100) : 0

      const newStats = {
        totalMalls: mallsResult.count || 0,
        totalShops: shopsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalRevenue,
        recentInquiries: inquiriesResult.data?.length || 0,
        activeUsers: usersResult.data?.length || 0,
        occupancyRate,
        monthlyGrowth: 12.5,
      }

      console.log("Dashboard stats fetched successfully:", newStats)
      setStats(newStats)
      setConnectionError(null)
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error)
      setConnectionError(error.message)
      
      // Set fallback data
      setStats({
        totalMalls: 0,
        totalShops: 0,
        totalBookings: 0,
        totalRevenue: 0,
        recentInquiries: 0,
        activeUsers: 0,
        occupancyRate: 0,
        monthlyGrowth: 0,
      })
    }
  }

  const fetchRecentActivities = async () => {
    try {
      console.log("Fetching recent activities...")
      
      const [inquiriesResult, bookingsResult] = await Promise.all([
        supabase
          .from("inquiries")
          .select(`
            id,
            inquiry_type,
            created_at,
            users (user_name),
            shops (title)
          `)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("bookings")
          .select(`
            id,
            booking_type,
            created_at,
            users (user_name),
            shops (title)
          `)
          .order("created_at", { ascending: false })
          .limit(5),
      ])

      const activities: RecentActivity[] = []

      // Handle inquiries
      if (inquiriesResult.data && !inquiriesResult.error) {
        inquiriesResult.data.forEach((inquiry) => {
          activities.push({
            id: inquiry.id,
            user: inquiry.users?.user_name || "Unknown User",
            action: "Created new inquiry",
            target: inquiry.shops?.title || "Unknown Shop",
            time: new Date(inquiry.created_at).toLocaleString(),
            avatar: inquiry.users?.user_name?.substring(0, 2).toUpperCase() || "UN",
            type: "inquiry",
          })
        })
      }

      // Handle bookings
      if (bookingsResult.data && !bookingsResult.error) {
        bookingsResult.data.forEach((booking) => {
          activities.push({
            id: booking.id,
            user: booking.users?.user_name || "Unknown User",
            action: "Created new booking",
            target: booking.shops?.title || "Unknown Shop",
            time: new Date(booking.created_at).toLocaleString(),
            avatar: booking.users?.user_name?.substring(0, 2).toUpperCase() || "UN",
            type: "booking",
          })
        })
      }

      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      const finalActivities = activities.slice(0, 10)
      
      console.log("Recent activities fetched:", finalActivities.length, "items")
      setRecentActivities(finalActivities)
    } catch (error: any) {
      console.error("Error fetching recent activities:", error)
      setRecentActivities([])
    }
  }

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchStats(), fetchRecentActivities()])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    stats,
    recentActivities,
    loading,
    connectionError,
    refetch: fetchData,
  }
}
