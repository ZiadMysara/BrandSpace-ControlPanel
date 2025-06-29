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
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Inquiry {
  id: number
  shop_id: number
  user_id: number
  developer_id: number
  inquiry_type: string
  message: string
  contact_preference: string
  preferred_contact_time: string
  status: string
  response: string
  responded_at: string
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

export default function InquiriesPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null)
  const [formData, setFormData] = useState({
    shop_id: "",
    user_id: "",
    developer_id: "",
    inquiry_type: "general",
    message: "",
    contact_preference: "email",
    preferred_contact_time: "",
    status: "pending",
    response: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
    fetchShops()
    fetchUsers()
    fetchDevelopers()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("inquiries")
        .select(`
          *,
          shops (title),
          users (user_name, email),
          developers (company_name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setInquiries(data || [])
    } catch (error) {
      console.error("Error fetching inquiries:", error)
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
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
      if (!formData.shop_id || !formData.user_id || !formData.developer_id || !formData.message) {
        toast({
          title: "Error",
          description: "Please fill in required fields",
          variant: "destructive",
        })
        return
      }

      const inquiryData = {
        shop_id: Number.parseInt(formData.shop_id),
        user_id: Number.parseInt(formData.user_id),
        developer_id: Number.parseInt(formData.developer_id),
        inquiry_type: formData.inquiry_type,
        message: formData.message,
        contact_preference: formData.contact_preference,
        preferred_contact_time: formData.preferred_contact_time || null,
        status: formData.status,
        response: formData.response || null,
        responded_at: formData.response && formData.status === "responded" ? new Date().toISOString() : null,
      }

      let result
      if (editingInquiry) {
        result = await supabase.from("inquiries").update(inquiryData).eq("id", editingInquiry.id)
      } else {
        result = await supabase.from("inquiries").insert([inquiryData])
      }

      if (result.error) throw result.error

      toast({
        title: "Success",
        description: editingInquiry ? "Inquiry updated successfully" : "Inquiry created successfully",
      })

      setIsAddDialogOpen(false)
      setEditingInquiry(null)
      resetForm()
      fetchInquiries()
    } catch (error: any) {
      console.error("Error saving inquiry:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save inquiry",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      shop_id: "",
      user_id: "",
      developer_id: "",
      inquiry_type: "general",
      message: "",
      contact_preference: "email",
      preferred_contact_time: "",
      status: "pending",
      response: "",
    })
  }

  const handleDelete = async (inquiryId: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return

    try {
      const { error } = await supabase.from("inquiries").delete().eq("id", inquiryId)
      if (error) throw error

      toast({
        title: "Success",
        description: "Inquiry deleted successfully",
      })
      fetchInquiries()
    } catch (error) {
      console.error("Error deleting inquiry:", error)
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (inquiry: Inquiry) => {
    setEditingInquiry(inquiry)
    setFormData({
      shop_id: inquiry.shop_id.toString(),
      user_id: inquiry.user_id.toString(),
      developer_id: inquiry.developer_id.toString(),
      inquiry_type: inquiry.inquiry_type,
      message: inquiry.message,
      contact_preference: inquiry.contact_preference,
      preferred_contact_time: inquiry.preferred_contact_time || "",
      status: inquiry.status,
      response: inquiry.response || "",
    })
    setIsAddDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        className: "falcon-badge warning",
        label: locale === "ar" ? "معلق" : "Pending",
      },
      responded: {
        className: "falcon-badge success",
        label: locale === "ar" ? "تم الرد" : "Responded",
      },
      closed: {
        className: "falcon-badge danger",
        label: locale === "ar" ? "مغلق" : "Closed",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <span className={config.className}>{config.label}</span>
  }

  const filteredInquiries = inquiries.filter((inquiry) => {
    const searchFields = [
      inquiry.shops?.title,
      inquiry.users?.user_name,
      inquiry.users?.email,
      inquiry.developers?.company_name,
      inquiry.message,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || inquiry.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className={cn("min-h-screen bg-slate-50", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "إدارة الاستفسارات" : "Inquiry Management"}
          subtitle={locale === "ar" ? "إدارة جميع استفسارات العملاء" : "Manage all customer inquiries"}
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
                      {locale === "ar" ? "إجمالي الاستفسارات" : "Total Inquiries"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{inquiries.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
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
                      {inquiries.filter((i) => i.status === "pending").length}
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
                    <p className="text-sm font-medium text-slate-600">{locale === "ar" ? "تم الرد" : "Responded"}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {inquiries.filter((i) => i.status === "responded").length}
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
                    <p className="text-sm font-medium text-slate-600">{locale === "ar" ? "مغلقة" : "Closed"}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {inquiries.filter((i) => i.status === "closed").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
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
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {locale === "ar" ? "الاستفسارات" : "Inquiries"}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {locale === "ar" ? `إجمالي ${inquiries.length} استفسار` : `Total ${inquiries.length} inquiries`}
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
                        setEditingInquiry(null)
                        resetForm()
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {locale === "ar" ? "إضافة استفسار" : "Add Inquiry"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900">
                          {editingInquiry
                            ? locale === "ar"
                              ? "تعديل استفسار"
                              : "Edit Inquiry"
                            : locale === "ar"
                              ? "إضافة استفسار جديد"
                              : "Add New Inquiry"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                          {locale === "ar"
                            ? "املأ النموذج أدناه لإضافة استفسار جديد"
                            : "Fill out the form below to add a new inquiry"}
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
                              <Label htmlFor="inquiry_type" className="text-slate-700">
                                {locale === "ar" ? "نوع الاستفسار" : "Inquiry Type"}
                              </Label>
                              <Select
                                value={formData.inquiry_type}
                                onValueChange={(value) => setFormData({ ...formData, inquiry_type: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="rent">{locale === "ar" ? "إيجار" : "Rent"}</SelectItem>
                                  <SelectItem value="buy">{locale === "ar" ? "شراء" : "Buy"}</SelectItem>
                                  <SelectItem value="visit">{locale === "ar" ? "زيارة" : "Visit"}</SelectItem>
                                  <SelectItem value="general">{locale === "ar" ? "عام" : "General"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="message" className="text-slate-700">
                              {locale === "ar" ? "الرسالة" : "Message"}
                            </Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              className="border-slate-200 focus:border-blue-500"
                              rows={3}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="contact_preference" className="text-slate-700">
                                {locale === "ar" ? "تفضيل التواصل" : "Contact Preference"}
                              </Label>
                              <Select
                                value={formData.contact_preference}
                                onValueChange={(value) => setFormData({ ...formData, contact_preference: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="phone">{locale === "ar" ? "هاتف" : "Phone"}</SelectItem>
                                  <SelectItem value="email">{locale === "ar" ? "بريد إلكتروني" : "Email"}</SelectItem>
                                  <SelectItem value="whatsapp">{locale === "ar" ? "واتساب" : "WhatsApp"}</SelectItem>
                                </SelectContent>
                              </Select>
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
                                  <SelectItem value="responded">{locale === "ar" ? "تم الرد" : "Responded"}</SelectItem>
                                  <SelectItem value="closed">{locale === "ar" ? "مغلق" : "Closed"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="preferred_contact_time" className="text-slate-700">
                              {locale === "ar" ? "الوقت المفضل للتواصل" : "Preferred Contact Time"}
                            </Label>
                            <Input
                              id="preferred_contact_time"
                              value={formData.preferred_contact_time}
                              onChange={(e) => setFormData({ ...formData, preferred_contact_time: e.target.value })}
                              className="border-slate-200 focus:border-blue-500"
                              placeholder={locale === "ar" ? "مثال: صباحاً 9-12" : "e.g., Morning 9-12"}
                            />
                          </div>

                          {(formData.status === "responded" || editingInquiry?.status === "responded") && (
                            <div>
                              <Label htmlFor="response" className="text-slate-700">
                                {locale === "ar" ? "الرد" : "Response"}
                              </Label>
                              <Textarea
                                id="response"
                                value={formData.response}
                                onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                                rows={3}
                              />
                            </div>
                          )}
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
                            {editingInquiry
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
                    placeholder={locale === "ar" ? "البحث في الاستفسارات..." : "Search inquiries..."}
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
                    <SelectItem value="responded">{locale === "ar" ? "تم الرد" : "Responded"}</SelectItem>
                    <SelectItem value="closed">{locale === "ar" ? "مغلق" : "Closed"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Inquiries Table */}
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
                        {locale === "ar" ? "الرسالة" : "Message"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "الحالة" : "Status"}
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
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                        </TableCell>
                      </TableRow>
                    ) : filteredInquiries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "لا توجد استفسارات" : "No inquiries found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInquiries.map((inquiry) => (
                        <TableRow key={inquiry.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-900">{inquiry.shops?.title}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-slate-900">{inquiry.users?.user_name}</div>
                              <div className="text-sm text-slate-500">{inquiry.users?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="falcon-badge bg-blue-100 text-blue-800">
                              {inquiry.inquiry_type === "rent"
                                ? locale === "ar"
                                  ? "إيجار"
                                  : "Rent"
                                : inquiry.inquiry_type === "buy"
                                  ? locale === "ar"
                                    ? "شراء"
                                    : "Buy"
                                  : inquiry.inquiry_type === "visit"
                                    ? locale === "ar"
                                      ? "زيارة"
                                      : "Visit"
                                    : locale === "ar"
                                      ? "عام"
                                      : "General"}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate text-slate-700" title={inquiry.message}>
                              {inquiry.message}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                          <TableCell className="text-slate-700">
                            {new Date(inquiry.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(inquiry)} className="text-slate-700">
                                  <Edit className="mr-2 h-4 w-4" />
                                  {locale === "ar" ? "تعديل" : "Edit"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(inquiry.id)} className="text-red-600">
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
