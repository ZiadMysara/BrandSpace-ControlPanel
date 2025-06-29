"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  CreditCard,
  Clock,
  CheckCircle,
  DollarSign,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Payment {
  id: number
  booking_id: number
  user_id: number
  amount: number
  payment_type: string
  payment_method: string
  payment_status: string
  transaction_id: string
  payment_gateway_response: any
  due_date: string
  paid_at: string
  created_at: string
  updated_at: string
  bookings?: { id: number; shops?: { title: string } }
  users?: { user_name: string; email: string }
}

interface Booking {
  id: number
  shops?: { title: string }
}

interface User {
  id: number
  user_name: string
  email: string
}

export default function PaymentsPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [payments, setPayments] = useState<Payment[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [formData, setFormData] = useState({
    booking_id: "",
    user_id: "",
    amount: "",
    payment_type: "monthly_rent",
    payment_method: "credit_card",
    payment_status: "pending",
    transaction_id: "",
    due_date: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchPayments()
    fetchBookings()
    fetchUsers()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          bookings (id, shops (title)),
          users (user_name, email)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, shops (title)")
        .order("id", { ascending: false })
      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!formData.booking_id || !formData.user_id || !formData.amount) {
        toast({
          title: "Error",
          description: "Please fill in required fields",
          variant: "destructive",
        })
        return
      }

      const paymentData = {
        booking_id: Number.parseInt(formData.booking_id),
        user_id: Number.parseInt(formData.user_id),
        amount: Number.parseFloat(formData.amount),
        payment_type: formData.payment_type,
        payment_method: formData.payment_method,
        payment_status: formData.payment_status,
        transaction_id: formData.transaction_id || null,
        due_date: formData.due_date || null,
        paid_at: formData.payment_status === "completed" ? new Date().toISOString() : null,
      }

      let result
      if (editingPayment) {
        result = await supabase.from("payments").update(paymentData).eq("id", editingPayment.id)
      } else {
        result = await supabase.from("payments").insert([paymentData])
      }

      if (result.error) throw result.error

      toast({
        title: "Success",
        description: editingPayment ? "Payment updated successfully" : "Payment created successfully",
      })

      setIsAddDialogOpen(false)
      setEditingPayment(null)
      resetForm()
      fetchPayments()
    } catch (error: any) {
      console.error("Error saving payment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save payment",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      booking_id: "",
      user_id: "",
      amount: "",
      payment_type: "monthly_rent",
      payment_method: "credit_card",
      payment_status: "pending",
      transaction_id: "",
      due_date: "",
    })
  }

  const handleDelete = async (paymentId: number) => {
    if (!confirm("Are you sure you want to delete this payment?")) return

    try {
      const { error } = await supabase.from("payments").delete().eq("id", paymentId)
      if (error) throw error

      toast({
        title: "Success",
        description: "Payment deleted successfully",
      })
      fetchPayments()
    } catch (error) {
      console.error("Error deleting payment:", error)
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment)
    setFormData({
      booking_id: payment.booking_id.toString(),
      user_id: payment.user_id.toString(),
      amount: payment.amount.toString(),
      payment_type: payment.payment_type,
      payment_method: payment.payment_method,
      payment_status: payment.payment_status,
      transaction_id: payment.transaction_id || "",
      due_date: payment.due_date || "",
    })
    setIsAddDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        className: "falcon-badge warning",
        label: locale === "ar" ? "معلق" : "Pending",
      },
      completed: {
        className: "falcon-badge success",
        label: locale === "ar" ? "مكتمل" : "Completed",
      },
      failed: {
        className: "falcon-badge danger",
        label: locale === "ar" ? "فشل" : "Failed",
      },
      refunded: {
        className: "falcon-badge info",
        label: locale === "ar" ? "مسترد" : "Refunded",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <span className={config.className}>{config.label}</span>
  }

  const filteredPayments = payments.filter((payment) => {
    const searchFields = [
      payment.bookings?.shops?.title,
      payment.users?.user_name,
      payment.users?.email,
      payment.transaction_id,
      payment.amount.toString(),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || payment.payment_status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className={cn("min-h-screen bg-slate-50", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "إدارة المدفوعات" : "Payment Management"}
          subtitle={
            locale === "ar"
              ? "إدارة جميع المدفوعات والمعاملات المالية"
              : "Manage all payments and financial transactions"
          }
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
                      {locale === "ar" ? "إجمالي المدفوعات" : "Total Payments"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{payments.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
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
                      {payments.filter((p) => p.payment_status === "pending").length}
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
                    <p className="text-sm font-medium text-slate-600">{locale === "ar" ? "مكتملة" : "Completed"}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {payments.filter((p) => p.payment_status === "completed").length}
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
                      {locale === "ar" ? "إجمالي المبلغ" : "Total Amount"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      ${payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
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
                    <CreditCard className="mr-2 h-5 w-5" />
                    {locale === "ar" ? "المدفوعات" : "Payments"}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {locale === "ar" ? `إجمالي ${payments.length} دفعة` : `Total ${payments.length} payments`}
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
                        setEditingPayment(null)
                        resetForm()
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {locale === "ar" ? "إضافة دفعة" : "Add Payment"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900">
                          {editingPayment
                            ? locale === "ar"
                              ? "تعديل دفعة"
                              : "Edit Payment"
                            : locale === "ar"
                              ? "إضافة دفعة جديدة"
                              : "Add New Payment"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                          {locale === "ar"
                            ? "املأ النموذج أدناه لإضافة دفعة جديدة"
                            : "Fill out the form below to add a new payment"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="booking_id" className="text-slate-700">
                                {locale === "ar" ? "الحجز" : "Booking"}
                              </Label>
                              <Select
                                value={formData.booking_id}
                                onValueChange={(value) => setFormData({ ...formData, booking_id: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue placeholder={locale === "ar" ? "اختر الحجز" : "Select booking"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {bookings.map((booking) => (
                                    <SelectItem key={booking.id} value={booking.id.toString()}>
                                      #{booking.id} - {booking.shops?.title}
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
                              <Label htmlFor="amount" className="text-slate-700">
                                {locale === "ar" ? "المبلغ" : "Amount"}
                              </Label>
                              <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="payment_type" className="text-slate-700">
                                {locale === "ar" ? "نوع الدفع" : "Payment Type"}
                              </Label>
                              <Select
                                value={formData.payment_type}
                                onValueChange={(value) => setFormData({ ...formData, payment_type: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="security_deposit">
                                    {locale === "ar" ? "تأمين" : "Security Deposit"}
                                  </SelectItem>
                                  <SelectItem value="monthly_rent">
                                    {locale === "ar" ? "إيجار شهري" : "Monthly Rent"}
                                  </SelectItem>
                                  <SelectItem value="commission">{locale === "ar" ? "عمولة" : "Commission"}</SelectItem>
                                  <SelectItem value="purchase">{locale === "ar" ? "شراء" : "Purchase"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="payment_method" className="text-slate-700">
                                {locale === "ar" ? "طريقة الدفع" : "Payment Method"}
                              </Label>
                              <Select
                                value={formData.payment_method}
                                onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="credit_card">
                                    {locale === "ar" ? "بطاقة ائتمان" : "Credit Card"}
                                  </SelectItem>
                                  <SelectItem value="bank_transfer">
                                    {locale === "ar" ? "تحويل بنكي" : "Bank Transfer"}
                                  </SelectItem>
                                  <SelectItem value="cash">{locale === "ar" ? "نقدي" : "Cash"}</SelectItem>
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
                                  <SelectItem value="completed">{locale === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                                  <SelectItem value="failed">{locale === "ar" ? "فشل" : "Failed"}</SelectItem>
                                  <SelectItem value="refunded">{locale === "ar" ? "مسترد" : "Refunded"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="transaction_id" className="text-slate-700">
                                {locale === "ar" ? "رقم المعاملة" : "Transaction ID"}
                              </Label>
                              <Input
                                id="transaction_id"
                                value={formData.transaction_id}
                                onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                                placeholder={locale === "ar" ? "رقم المعاملة" : "Transaction ID"}
                              />
                            </div>
                            <div>
                              <Label htmlFor="due_date" className="text-slate-700">
                                {locale === "ar" ? "تاريخ الاستحقاق" : "Due Date"}
                              </Label>
                              <Input
                                id="due_date"
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
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
                            {editingPayment
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
                    placeholder={locale === "ar" ? "البحث في المدفوعات..." : "Search payments..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white text-slate-900"
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
                    <SelectItem value="completed">{locale === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                    <SelectItem value="failed">{locale === "ar" ? "فشل" : "Failed"}</SelectItem>
                    <SelectItem value="refunded">{locale === "ar" ? "مسترد" : "Refunded"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payments Table */}
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
                        {locale === "ar" ? "المبلغ" : "Amount"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "النوع" : "Type"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "الطريقة" : "Method"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "الحالة" : "Status"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "رقم المعاملة" : "Transaction ID"}
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
                    ) : filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "لا توجد مدفوعات" : "No payments found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-900">
                            {payment.bookings?.shops?.title || "-"}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-slate-900">{payment.users?.user_name}</div>
                              <div className="text-sm text-slate-500">{payment.users?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            ${payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className="falcon-badge bg-blue-100 text-blue-800">
                              {payment.payment_type === "security_deposit"
                                ? locale === "ar"
                                  ? "تأمين"
                                  : "Security Deposit"
                                : payment.payment_type === "monthly_rent"
                                  ? locale === "ar"
                                    ? "إيجار شهري"
                                    : "Monthly Rent"
                                  : payment.payment_type === "commission"
                                    ? locale === "ar"
                                      ? "عمولة"
                                      : "Commission"
                                    : locale === "ar"
                                      ? "شراء"
                                      : "Purchase"}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {payment.payment_method === "credit_card"
                              ? locale === "ar"
                                ? "بطاقة ائتمان"
                                : "Credit Card"
                              : payment.payment_method === "bank_transfer"
                                ? locale === "ar"
                                  ? "تحويل بنكي"
                                  : "Bank Transfer"
                                : locale === "ar"
                                  ? "نقدي"
                                  : "Cash"}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                          <TableCell className="text-slate-700 font-mono text-sm">
                            {payment.transaction_id || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(payment)} className="text-slate-700">
                                  <Edit className="mr-2 h-4 w-4" />
                                  {locale === "ar" ? "تعديل" : "Edit"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(payment.id)} className="text-red-600">
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
