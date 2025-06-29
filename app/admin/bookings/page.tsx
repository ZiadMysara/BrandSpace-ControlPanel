"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle,
  DollarSign,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: number
  shop_id: number
  user_id: number
  developer_id: number
  booking_type: string
  start_date: string
  end_date: string
  monthly_amount: number
  total_amount: number
  security_deposit: number
  commission_amount: number
  contract_duration: number
  status: string
  payment_status: string
  contract_file: string
  notes: string
  created_at: string
  updated_at: string
  shops?: { title: string }
  users?: { user_name: string; email: string }
  developers?: { company_name: string }
}

interface Shop {
  id: number
  title: string
}

interface User {
  id: number
  user_name: string
  email: string
}

interface Developer {
  id: number
  company_name: string
}

export default function BookingsPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [formData, setFormData] = useState({
    shop_id: "",
    user_id: "",
    developer_id: "",
    booking_type: "rent",
    start_date: "",
    end_date: "",
    monthly_amount: "",
    total_amount: "",
    security_deposit: "",
    commission_amount: "",
    contract_duration: "",
    status: "pending",
    payment_status: "pending",
    notes: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
    fetchShops()
    fetchUsers()
    fetchDevelopers()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          shops (title),
          users (user_name, email),
          developers (company_name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from("shops").select("id, title").order("title")
      if (error) throw error
      setShops(data || [])
    } catch (error) {
      console.error("Error fetching shops:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("id, user_name, email").order("user_name")
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchDevelopers = async () => {
    try {
      const { data, error } = await supabase.from("developers").select("id, company_name").order("company_name")
      if (error) throw error
      setDevelopers(data || [])
    } catch (error) {
      console.error("Error fetching developers:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!formData.shop_id || !formData.user_id || !formData.developer_id) {
        toast({
          title: "Error",
          description: "Please fill in required fields",
          variant: "destructive",
        })
        return
      }

      const bookingData = {
        shop_id: Number.parseInt(formData.shop_id),
        user_id: Number.parseInt(formData.user_id),
        developer_id: Number.parseInt(formData.developer_id),
        booking_type: formData.booking_type,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        monthly_amount: formData.monthly_amount ? Number.parseFloat(formData.monthly_amount) : null,
        total_amount: formData.total_amount ? Number.parseFloat(formData.total_amount) : null,
        security_deposit: formData.security_deposit ? Number.parseFloat(formData.security_deposit) : null,
        commission_amount: formData.commission_amount ? Number.parseFloat(formData.commission_amount) : null,
        contract_duration: formData.contract_duration ? Number.parseInt(formData.contract_duration) : null,
        status: formData.status,
        payment_status: formData.payment_status,
        notes: formData.notes || null,
      }

      let result
      if (editingBooking) {
        result = await supabase.from("bookings").update(bookingData).eq("id", editingBooking.id)
      } else {
        result = await supabase.from("bookings").insert([bookingData])
      }

      if (result.error) throw result.error

      toast({
        title: "Success",
        description: editingBooking ? "Booking updated successfully" : "Booking created successfully",
      })

      setIsAddDialogOpen(false)
      setEditingBooking(null)
      resetForm()
      fetchBookings()
    } catch (error: any) {
      console.error("Error saving booking:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save booking",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      shop_id: "",
      user_id: "",
      developer_id: "",
      booking_type: "rent",
      start_date: "",
      end_date: "",
      monthly_amount: "",
      total_amount: "",
      security_deposit: "",
      commission_amount: "",
      contract_duration: "",
      status: "pending",
      payment_status: "pending",
      notes: "",
    })
  }

  const handleDelete = async (bookingId: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return

    try {
      const { error } = await supabase.from("bookings").delete().eq("id", bookingId)
      if (error) throw error

      toast({
        title: "Success",
        description: "Booking deleted successfully",
      })
      fetchBookings()
    } catch (error) {
      console.error("Error deleting booking:", error)
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking)
    setFormData({
      shop_id: booking.shop_id.toString(),
      user_id: booking.user_id.toString(),
      developer_id: booking.developer_id.toString(),
      booking_type: booking.booking_type,
      start_date: booking.start_date || "",
      end_date: booking.end_date || "",
      monthly_amount: booking.monthly_amount?.toString() || "",
      total_amount: booking.total_amount?.toString() || "",
      security_deposit: booking.security_deposit?.toString() || "",
      commission_amount: booking.commission_amount?.toString() || "",
      contract_duration: booking.contract_duration?.toString() || "",
      status: booking.status,
      payment_status: booking.payment_status,
      notes: booking.notes || "",
    })
    setIsAddDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        className: "falcon-badge warning",
        label: locale === "ar" ? "معلق" : "Pending",
      },
      confirmed: {
        className: "falcon-badge success",
        label: locale === "ar" ? "مؤكد" : "Confirmed",
      },
      cancelled: {
        className: "falcon-badge danger",
        label: locale === "ar" ? "ملغي" : "Cancelled",
      },
      completed: {
        className: "falcon-badge info",
        label: locale === "ar" ? "مكتمل" : "Completed",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <span className={config.className}>{config.label}</span>
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        className: "falcon-badge warning",
        label: locale === "ar" ? "معلق" : "Pending",
      },
      partial: {
        className: "falcon-badge info",
        label: locale === "ar" ? "جزئي" : "Partial",
      },
      completed: {
        className: "falcon-badge success",
        label: locale === "ar" ? "مكتمل" : "Completed",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <span className={config.className}>{config.label}</span>
  }

  const filteredBookings = bookings.filter((booking) => {
    const searchFields = [
      booking.shops?.title,
      booking.users?.user_name,
      booking.users?.email,
      booking.developers?.company_name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className={cn("min-h-screen bg-slate-50", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "إدارة الحجوزات" : "Booking Management"}
          subtitle={locale === "ar" ? "إدارة جميع حجوزات المحلات" : "Manage all shop bookings"}
          locale={locale}
        />

        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "إجمالي الحجوزات" : "Total Bookings"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{bookings.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{locale === "ar" ? "معلقة" : "Pending"}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {bookings.filter((b) => b.status === "pending").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{locale === "ar" ? "مؤكدة" : "Confirmed"}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {bookings.filter((b) => b.status === "confirmed").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      ${bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="falcon-card">
            <CardHeader className="falcon-card-header">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
                    <Calendar className="mr-2 h-5 w-5" />
                    {locale === "ar" ? "الحجوزات" : "Bookings"}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {locale === "ar" ? `إجمالي ${bookings.length} حجز` : `Total ${bookings.length} bookings`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50">
                    <Download className="h-4 w-4 mr-2" />
                    {locale === "ar" ? "تصدير" : "Export"}
                  </Button>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open) => {
                      setIsAddDialogOpen(open)
                      if (!open) {
                        setEditingBooking(null)
                        resetForm()
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {locale === "ar" ? "إضافة حجز" : "Add Booking"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900">
                          {editingBooking
                            ? locale === "ar"
                              ? "تعديل حجز"
                              : "Edit Booking"
                            : locale === "ar"
                              ? "إضافة حجز جديد"
                              : "Add New Booking"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                          {locale === "ar"
                            ? "املأ النموذج أدناه لإضافة حجز جديد"
                            : "Fill out the form below to add a new booking"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="shop_id" className="text-slate-700">
                                {locale === "ar" ? "المحل" : "Shop"}
                              </Label>
                              <Select
                                value={formData.shop_id}
                                onValueChange={(value) => setFormData({ ...formData, shop_id: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue placeholder={locale === "ar" ? "اختر المحل" : "Select shop"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {shops.map((shop) => (
                                    <SelectItem key={shop.id} value={shop.id.toString()}>
                                      {shop.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="user_id" className="text-slate-700">
                                {locale === "ar" ? "المستخدم" : "User"}
                              </Label>
                              <Select
                                value={formData.user_id}
                                onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue placeholder={locale === "ar" ? "اختر المستخدم" : "Select user"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                      {user.user_name} ({user.email})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="developer_id" className="text-slate-700">
                                {locale === "ar" ? "المطور" : "Developer"}
                              </Label>
                              <Select
                                value={formData.developer_id}
                                onValueChange={(value) => setFormData({ ...formData, developer_id: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue placeholder={locale === "ar" ? "اختر المطور" : "Select developer"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {developers.map((developer) => (
                                    <SelectItem key={developer.id} value={developer.id.toString()}>
                                      {developer.company_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="booking_type" className="text-slate-700">
                                {locale === "ar" ? "نوع الحجز" : "Booking Type"}
                              </Label>
                              <Select
                                value={formData.booking_type}
                                onValueChange={(value) => setFormData({ ...formData, booking_type: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="rent">{locale === "ar" ? "إيجار" : "Rent"}</SelectItem>
                                  <SelectItem value="purchase">{locale === "ar" ? "شراء" : "Purchase"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="start_date" className="text-slate-700">
                                {locale === "ar" ? "تاريخ البداية" : "Start Date"}
                              </Label>
                              <Input
                                id="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="end_date" className="text-slate-700">
                                {locale === "ar" ? "تاريخ النهاية" : "End Date"}
                              </Label>
                              <Input
                                id="end_date"
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="monthly_amount" className="text-slate-700">
                                {locale === "ar" ? "المبلغ الشهري" : "Monthly Amount"}
                              </Label>
                              <Input
                                id="monthly_amount"
                                type="number"
                                step="0.01"
                                value={formData.monthly_amount}
                                onChange={(e) => setFormData({ ...formData, monthly_amount: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="total_amount" className="text-slate-700">
                                {locale === "ar" ? "المبلغ الإجمالي" : "Total Amount"}
                              </Label>
                              <Input
                                id="total_amount"
                                type="number"
                                step="0.01"
                                value={formData.total_amount}
                                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="security_deposit" className="text-slate-700">
                                {locale === "ar" ? "التأمين" : "Security Deposit"}
                              </Label>
                              <Input
                                id="security_deposit"
                                type="number"
                                step="0.01"
                                value={formData.security_deposit}
                                onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="commission_amount" className="text-slate-700">
                                {locale === "ar" ? "العمولة" : "Commission"}
                              </Label>
                              <Input
                                id="commission_amount"
                                type="number"
                                step="0.01"
                                value={formData.commission_amount}
                                onChange={(e) => setFormData({ ...formData, commission_amount: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="contract_duration" className="text-slate-700">
                                {locale === "ar" ? "مدة العقد (شهر)" : "Contract Duration (months)"}
                              </Label>
                              <Input
                                id="contract_duration"
                                type="number"
                                value={formData.contract_duration}
                                onChange={(e) => setFormData({ ...formData, contract_duration: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="status" className="text-slate-700">
                                {locale === "ar" ? "الحالة" : "Status"}
                              </Label>
                              <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">{locale === "ar" ? "معلق" : "Pending"}</SelectItem>
                                  <SelectItem value="confirmed">{locale === "ar" ? "مؤكد" : "Confirmed"}</SelectItem>
                                  <SelectItem value="cancelled">{locale === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
                                  <SelectItem value="completed">{locale === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="payment_status" className="text-slate-700">
                                {locale === "ar" ? "حالة الدفع" : "Payment Status"}
                              </Label>
                              <Select
                                value={formData.payment_status}
                                onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">{locale === "ar" ? "معلق" : "Pending"}</SelectItem>
                                  <SelectItem value="partial">{locale === "ar" ? "جزئي" : "Partial"}</SelectItem>
                                  <SelectItem value="completed">{locale === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="notes" className="text-slate-700">
                              {locale === "ar" ? "ملاحظات" : "Notes"}
                            </Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              className="border-slate-200 focus:border-blue-500"
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="border-slate-200 text-slate-600"
                          >
                            {locale === "ar" ? "إلغاء" : "Cancel"}
                          </Button>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            {editingBooking
                              ? locale === "ar"
                                ? "تحديث"
                                : "Update"
                              : locale === "ar"
                                ? "إضافة"
                                : "Add"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="falcon-card-content">
              {/* Search and Filter */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder={locale === "ar" ? "البحث في الحجوزات..." : "Search bookings..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 border-slate-200 focus:border-blue-500 bg-white hover:bg-slate-50">
                    <Filter className="h-4 w-4 mr-2 text-slate-500" />
                    <SelectValue placeholder={locale === "ar" ? "تصفية حسب الحالة" : "Filter by status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === "ar" ? "جميع الحالات" : "All Status"}</SelectItem>
                    <SelectItem value="pending">{locale === "ar" ? "معلق" : "Pending"}</SelectItem>
                    <SelectItem value="confirmed">{locale === "ar" ? "مؤكد" : "Confirmed"}</SelectItem>
                    <SelectItem value="cancelled">{locale === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
                    <SelectItem value="completed">{locale === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bookings Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <Table className="falcon-table">
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "المحل" : "Shop"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "المستخدم" : "User"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "النوع" : "Type"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "المبلغ الإجمالي" : "Total Amount"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "حالة الحجز" : "Booking Status"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "حالة الدفع" : "Payment Status"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "تاريخ الإنشاء" : "Created"}
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">
                        {locale === "ar" ? "الإجراءات" : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                        </TableCell>
                      </TableRow>
                    ) : filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "لا توجد حجوزات" : "No bookings found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-900">{booking.shops?.title}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-slate-900">{booking.users?.user_name}</div>
                              <div className="text-sm text-slate-500">{booking.users?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="falcon-badge bg-blue-100 text-blue-800">
                              {booking.booking_type === "rent"
                                ? locale === "ar"
                                  ? "إيجار"
                                  : "Rent"
                                : locale === "ar"
                                  ? "شراء"
                                  : "Purchase"}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            ${booking.total_amount?.toLocaleString() || "0"}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                          <TableCell className="text-slate-700">
                            {new Date(booking.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(booking)} className="text-slate-700">
                                  <Edit className="mr-2 h-4 w-4" />
                                  {locale === "ar" ? "تعديل" : "Edit"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(booking.id)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {locale === "ar" ? "حذف" : "Delete"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
