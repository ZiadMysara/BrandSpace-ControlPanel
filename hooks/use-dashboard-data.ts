"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

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

  const fetchStats = async () => {
    try {
      const [mallsResult, shopsResult, bookingsResult, inquiriesResult, usersResult] = await Promise.all([
        supabase.from("malls").select("id", { count: "exact" }),
        supabase.from("shops").select("id, status", { count: "exact" }),
        supabase.from("bookings").select("id, total_amount", { count: "exact" }),
        supabase
          .from("inquiries")
          .select("id")
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("users").select("id").eq("is_active", true),
      ])

      const totalRevenue = bookingsResult.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
      const rentedShops = shopsResult.data?.filter((shop) => shop.status === "rented").length || 0
      const occupancyRate = shopsResult.count ? Math.round((rentedShops / shopsResult.count) * 100) : 0

      setStats({
        totalMalls: mallsResult.count || 0,
        totalShops: shopsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalRevenue,
        recentInquiries: inquiriesResult.data?.length || 0,
        activeUsers: usersResult.data?.length || 0,
        occupancyRate,
        monthlyGrowth: 12.5,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  const fetchRecentActivities = async () => {
    try {
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

      inquiriesResult.data?.forEach((inquiry) => {
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

      bookingsResult.data?.forEach((booking) => {
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

      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setRecentActivities(activities.slice(0, 10))
    } catch (error) {
      console.error("Error fetching recent activities:", error)
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
    refetch: fetchData,
  }
}