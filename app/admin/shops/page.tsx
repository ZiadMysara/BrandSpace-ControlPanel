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
  ShoppingBag,
  Store,
  MapPin,
  DollarSign,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Shop {
  id: number
  title: string
  mall_id: number
  category_type_id: number
  shop_number: string
  floor_number: number
  phone_number: string
  whatsapp_number: string
  email: string
  unit_area: number
  monthly_rent: number
  sale_price: number
  sale_type: string
  finishing_type: string
  delivery_date: string
  status: string
  description: string
  view_type: string
  is_corner_shop: boolean
  has_storage: boolean
  electricity_capacity: number
  security_deposit: number
  is_active: boolean
  created_at: string
  updated_at: string
  malls?: { ar_name: string; en_name: string }
  category_types?: { type_en_name: string; type_ar_name: string }
}

interface Mall {
  id: number
  ar_name: string
  en_name: string
}

interface CategoryType {
  id: number
  type_en_name: string
  type_ar_name: string
}

export default function ShopsPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [shops, setShops] = useState<Shop[]>([])
  const [malls, setMalls] = useState<Mall[]>([])
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    mall_id: "",
    category_type_id: "",
    shop_number: "",
    floor_number: "",
    phone_number: "",
    whatsapp_number: "",
    email: "",
    unit_area: "",
    monthly_rent: "",
    sale_price: "",
    sale_type: "rent",
    finishing_type: "not_finished",
    delivery_date: "",
    status: "available",
    description: "",
    view_type: "corridor",
    is_corner_shop: false,
    has_storage: false,
    electricity_capacity: "",
    security_deposit: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchShops()
    fetchMalls()
    fetchCategoryTypes()
  }, [])

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase
        .from("shops")
        .select(`
          *,
          malls (ar_name, en_name),
          category_types (type_en_name, type_ar_name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setShops(data || [])
    } catch (error) {
      console.error("Error fetching shops:", error)
      toast({
        title: "Error",
        description: "Failed to fetch shops",
        variant: "destructive",
      })
    }
  }

  const fetchMalls = async () => {
    try {
      const { data, error } = await supabase.from("malls").select("id, ar_name, en_name").order("en_name")

      if (error) throw error
      setMalls(data || [])
    } catch (error) {
      console.error("Error fetching malls:", error)
    }
  }

  const fetchCategoryTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("category_types")
        .select("id, type_en_name, type_ar_name")
        .order("type_en_name")

      if (error) throw error
      setCategoryTypes(data || [])
    } catch (error) {
      console.error("Error fetching category types:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Simple validation
      if (!formData.title || !formData.mall_id || !formData.category_type_id) {
        toast({
          title: "Error",
          description: "Please fill in required fields: Title, Mall, and Category",
          variant: "destructive",
        })
        return
      }

      const shopData = {
        title: formData.title,
        mall_id: Number.parseInt(formData.mall_id),
        category_type_id: Number.parseInt(formData.category_type_id),
        shop_number: formData.shop_number || null,
        floor_number: formData.floor_number ? Number.parseInt(formData.floor_number) : null,
        phone_number: formData.phone_number || null,
        whatsapp_number: formData.whatsapp_number || null,
        email: formData.email || null,
        unit_area: formData.unit_area ? Number.parseFloat(formData.unit_area) : null,
        monthly_rent: formData.monthly_rent ? Number.parseFloat(formData.monthly_rent) : null,
        sale_price: formData.sale_price ? Number.parseFloat(formData.sale_price) : null,
        sale_type: formData.sale_type,
        finishing_type: formData.finishing_type,
        delivery_date: formData.delivery_date || null,
        status: formData.status,
        description: formData.description || null,
        view_type: formData.view_type,
        is_corner_shop: formData.is_corner_shop,
        has_storage: formData.has_storage,
        electricity_capacity: formData.electricity_capacity ? Number.parseInt(formData.electricity_capacity) : null,
        security_deposit: formData.security_deposit ? Number.parseFloat(formData.security_deposit) : null,
        is_active: true,
      }

      let result
      if (editingShop) {
        result = await supabase.from("shops").update(shopData).eq("id", editingShop.id)
      } else {
        result = await supabase.from("shops").insert([shopData])
      }

      if (result.error) {
        throw result.error
      }

      toast({
        title: "Success",
        description: editingShop ? "Shop updated successfully" : "Shop created successfully",
      })

      setIsAddDialogOpen(false)
      setEditingShop(null)
      resetForm()
      fetchShops()
    } catch (error: any) {
      console.error("Error saving shop:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save shop",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      mall_id: "",
      category_type_id: "",
      shop_number: "",
      floor_number: "",
      phone_number: "",
      whatsapp_number: "",
      email: "",
      unit_area: "",
      monthly_rent: "",
      sale_price: "",
      sale_type: "rent",
      finishing_type: "not_finished",
      delivery_date: "",
      status: "available",
      description: "",
      view_type: "corridor",
      is_corner_shop: false,
      has_storage: false,
      electricity_capacity: "",
      security_deposit: "",
    })
  }

  const handleDelete = async (shopId: number) => {
    if (!confirm("Are you sure you want to delete this shop?")) return

    try {
      const { error } = await supabase.from("shops").delete().eq("id", shopId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Shop deleted successfully",
      })
      fetchShops()
    } catch (error) {
      console.error("Error deleting shop:", error)
      toast({
        title: "Error",
        description: "Failed to delete shop",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop)
    setFormData({
      title: shop.title,
      mall_id: shop.mall_id.toString(),
      category_type_id: shop.category_type_id.toString(),
      shop_number: shop.shop_number || "",
      floor_number: shop.floor_number?.toString() || "",
      phone_number: shop.phone_number || "",
      whatsapp_number: shop.whatsapp_number || "",
      email: shop.email || "",
      unit_area: shop.unit_area?.toString() || "",
      monthly_rent: shop.monthly_rent?.toString() || "",
      sale_price: shop.sale_price?.toString() || "",
      sale_type: shop.sale_type,
      finishing_type: shop.finishing_type || "not_finished",
      delivery_date: shop.delivery_date || "",
      status: shop.status,
      description: shop.description || "",
      view_type: shop.view_type || "corridor",
      is_corner_shop: shop.is_corner_shop,
      has_storage: shop.has_storage,
      electricity_capacity: shop.electricity_capacity?.toString() || "",
      security_deposit: shop.security_deposit?.toString() || "",
    })
    setIsAddDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: {
        className: "falcon-badge success",
        label: locale === "ar" ? "متاح" : "Available",
      },
      reserved: {
        className: "falcon-badge warning",
        label: locale === "ar" ? "محجوز" : "Reserved",
      },
      sold: {
        className: "falcon-badge danger",
        label: locale === "ar" ? "مباع" : "Sold",
      },
      rented: {
        className: "falcon-badge info",
        label: locale === "ar" ? "مؤجر" : "Rented",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available
    return <span className={config.className}>{config.label}</span>
  }

  const filteredShops = shops.filter((shop) => {
    const searchFields = [
      shop.title,
      shop.shop_number,
      shop.malls?.ar_name,
      shop.malls?.en_name,
      shop.category_types?.type_en_name,
      shop.category_types?.type_ar_name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || shop.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleOpenDialog = () => {
    resetForm()
    setEditingShop(null)
    setIsAddDialogOpen(true)
  }

  return (
    <div className={cn("min-h-screen bg-slate-50", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "إدارة المحلات" : "Shop Management"}
          subtitle={locale === "ar" ? "إدارة جميع المحلات في المولات" : "Manage all shops across malls"}
          locale={locale}
        />

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Stats Cards - Falcon Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "إجمالي المحلات" : "Total Shops"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{shops.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{locale === "ar" ? "متاحة" : "Available"}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {shops.filter((s) => s.status === "available").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Store className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{locale === "ar" ? "مؤجرة" : "Rented"}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {shops.filter((s) => s.status === "rented").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "متوسط الإيجار" : "Avg Rent"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      $
                      {Math.round(
                        shops.reduce((sum, shop) => sum + (shop.monthly_rent || 0), 0) / shops.length || 0,
                      ).toLocaleString()}
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
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {locale === "ar" ? "المحلات" : "Shops"}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {locale === "ar" ? `إجمالي ${shops.length} محل` : `Total ${shops.length} shops`}
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
                        setEditingShop(null)
                        resetForm()
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={handleOpenDialog}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {locale === "ar" ? "إضافة محل" : "Add Shop"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900">
                          {editingShop
                            ? locale === "ar"
                              ? "تعديل محل"
                              : "Edit Shop"
                            : locale === "ar"
                              ? "إضافة محل جديد"
                              : "Add New Shop"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                          {locale === "ar"
                            ? "املأ النموذج أدناه لإضافة محل جديد"
                            : "Fill out the form below to add a new shop"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="title" className="text-slate-700">
                                {locale === "ar" ? "عنوان المحل" : "Shop Title"}
                              </Label>
                              <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="shop_number" className="text-slate-700">
                                {locale === "ar" ? "رقم المحل" : "Shop Number"}
                              </Label>
                              <Input
                                id="shop_number"
                                value={formData.shop_number}
                                onChange={(e) => setFormData({ ...formData, shop_number: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="mall_id" className="text-slate-700">
                                {locale === "ar" ? "المول" : "Mall"}
                              </Label>
                              <Select
                                value={formData.mall_id}
                                onValueChange={(value) => setFormData({ ...formData, mall_id: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue placeholder={locale === "ar" ? "اختر المول" : "Select mall"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {malls.map((mall) => (
                                    <SelectItem key={mall.id} value={mall.id.toString()}>
                                      {locale === "ar" ? mall.ar_name : mall.en_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="category_type_id" className="text-slate-700">
                                {locale === "ar" ? "نوع الفئة" : "Category Type"}
                              </Label>
                              <Select
                                value={formData.category_type_id}
                                onValueChange={(value) => setFormData({ ...formData, category_type_id: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue placeholder={locale === "ar" ? "اختر الفئة" : "Select category"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {categoryTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                      {locale === "ar" ? type.type_ar_name : type.type_en_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="floor_number" className="text-slate-700">
                                {locale === "ar" ? "رقم الطابق" : "Floor Number"}
                              </Label>
                              <Input
                                id="floor_number"
                                type="number"
                                value={formData.floor_number}
                                onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="unit_area" className="text-slate-700">
                                {locale === "ar" ? "المساحة (م²)" : "Unit Area (m²)"}
                              </Label>
                              <Input
                                id="unit_area"
                                type="number"
                                step="0.01"
                                value={formData.unit_area}
                                onChange={(e) => setFormData({ ...formData, unit_area: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="monthly_rent" className="text-slate-700">
                                {locale === "ar" ? "الإيجار الشهري" : "Monthly Rent"}
                              </Label>
                              <Input
                                id="monthly_rent"
                                type="number"
                                step="0.01"
                                value={formData.monthly_rent}
                                onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                                className="border-slate-200 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="sale_type" className="text-slate-700">
                                {locale === "ar" ? "نوع البيع" : "Sale Type"}
                              </Label>
                              <Select
                                value={formData.sale_type}
                                onValueChange={(value) => setFormData({ ...formData, sale_type: value })}
                              >
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="rent">{locale === "ar" ? "إيجار" : "Rent"}</SelectItem>
                                  <SelectItem value="sale">{locale === "ar" ? "بيع" : "Sale"}</SelectItem>
                                  <SelectItem value="both">{locale === "ar" ? "كلاهما" : "Both"}</SelectItem>
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
                                  <SelectItem value="available">{locale === "ar" ? "متاح" : "Available"}</SelectItem>
                                  <SelectItem value="reserved">{locale === "ar" ? "محجوز" : "Reserved"}</SelectItem>
                                  <SelectItem value="sold">{locale === "ar" ? "مباع" : "Sold"}</SelectItem>
                                  <SelectItem value="rented">{locale === "ar" ? "مؤجر" : "Rented"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="description" className="text-slate-700">
                              {locale === "ar" ? "الوصف" : "Description"}
                            </Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                            {editingShop ? (locale === "ar" ? "تحديث" : "Update") : locale === "ar" ? "إضافة" : "Add"}
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
                    placeholder={locale === "ar" ? "البحث عن المحلات..." : "Search shops..."}
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
                    <SelectItem value="available">{locale === "ar" ? "متاح" : "Available"}</SelectItem>
                    <SelectItem value="reserved">{locale === "ar" ? "محجوز" : "Reserved"}</SelectItem>
                    <SelectItem value="sold">{locale === "ar" ? "مباع" : "Sold"}</SelectItem>
                    <SelectItem value="rented">{locale === "ar" ? "مؤجر" : "Rented"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Shops Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <Table className="falcon-table">
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "عنوان المحل" : "Shop Title"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "المول" : "Mall"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "الفئة" : "Category"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "الطابق/الرقم" : "Floor/Number"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "المساحة" : "Area"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "الإيجار" : "Rent"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "الحالة" : "Status"}
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">
                        {locale === "ar" ? "الإجراءات" : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShops.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "لا توجد محلات" : "No shops found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShops.map((shop) => (
                        <TableRow key={shop.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-900">{shop.title}</TableCell>
                          <TableCell className="text-slate-700">
                            {locale === "ar" ? shop.malls?.ar_name : shop.malls?.en_name}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {locale === "ar" ? shop.category_types?.type_ar_name : shop.category_types?.type_en_name}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="text-slate-900">Floor {shop.floor_number || "-"}</div>
                              <div className="text-slate-500">#{shop.shop_number || "-"}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {shop.unit_area ? `${shop.unit_area} m²` : "-"}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {shop.monthly_rent ? `$${shop.monthly_rent.toLocaleString()}` : "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(shop.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(shop)} className="text-slate-700">
                                  <Edit className="mr-2 h-4 w-4" />
                                  {locale === "ar" ? "تعديل" : "Edit"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(shop.id)} className="text-red-600">
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