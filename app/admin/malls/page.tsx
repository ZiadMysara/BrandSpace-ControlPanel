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
import { Plus, Search, Edit, Trash2, Download, Filter, MoreHorizontal, Building2, MapPin, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Mall {
  id: number
  ar_name: string
  en_name: string
  description: string
  address: string
  city: string
  district: string
  total_area: number
  total_floors: number
  parking_spaces: number
  construction_status: string
  completion_date: string
  is_active: boolean
  created_at: string
  developers?: { company_name: string }
}

interface Developer {
  id: number
  company_name: string
}

export default function MallsPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [malls, setMalls] = useState<Mall[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMall, setEditingMall] = useState<Mall | null>(null)
  const [formData, setFormData] = useState({
    ar_name: "",
    en_name: "",
    description: "",
    address: "",
    city: "",
    district: "",
    developer_id: "",
    total_area: "",
    total_floors: "",
    parking_spaces: "",
    construction_status: "planning",
    completion_date: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchMalls()
    fetchDevelopers()
  }, [])

  const fetchMalls = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("malls")
        .select(`
          *,
          developers (company_name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setMalls(data || [])
    } catch (error) {
      console.error("Error fetching malls:", error)
      toast({
        title: "Error",
        description: "Failed to fetch malls",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
      // Simple validation
      if (!formData.ar_name || !formData.en_name || !formData.city) {
        toast({
          title: "Error",
          description: "Please fill in required fields: Arabic name, English name, and city",
          variant: "destructive",
        })
        return
      }

      const mallData = {
        ar_name: formData.ar_name,
        en_name: formData.en_name,
        description: formData.description || null,
        address: formData.address || null,
        city: formData.city,
        district: formData.district || null,
        developer_id: formData.developer_id ? Number.parseInt(formData.developer_id) : null,
        total_area: formData.total_area ? Number.parseFloat(formData.total_area) : null,
        total_floors: formData.total_floors ? Number.parseInt(formData.total_floors) : null,
        parking_spaces: formData.parking_spaces ? Number.parseInt(formData.parking_spaces) : null,
        construction_status: formData.construction_status,
        completion_date: formData.completion_date || null,
        is_active: true,
      }

      let result
      if (editingMall) {
        result = await supabase.from("malls").update(mallData).eq("id", editingMall.id)
      } else {
        result = await supabase.from("malls").insert([mallData])
      }

      if (result.error) {
        throw result.error
      }

      toast({
        title: "Success",
        description: editingMall ? "Mall updated successfully" : "Mall created successfully",
      })

      setIsAddDialogOpen(false)
      setEditingMall(null)
      resetForm()
      fetchMalls()
    } catch (error: any) {
      console.error("Error saving mall:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save mall",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      ar_name: "",
      en_name: "",
      description: "",
      address: "",
      city: "",
      district: "",
      developer_id: "",
      total_area: "",
      total_floors: "",
      parking_spaces: "",
      construction_status: "planning",
      completion_date: "",
    })
  }

  const handleDelete = async (mallId: number) => {
    if (!confirm("Are you sure you want to delete this mall?")) return

    try {
      const { error } = await supabase.from("malls").delete().eq("id", mallId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Mall deleted successfully",
      })
      fetchMalls()
    } catch (error) {
      console.error("Error deleting mall:", error)
      toast({
        title: "Error",
        description: "Failed to delete mall",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (mall: Mall) => {
    setEditingMall(mall)
    setFormData({
      ar_name: mall.ar_name,
      en_name: mall.en_name,
      description: mall.description || "",
      address: mall.address || "",
      city: mall.city,
      district: mall.district || "",
      developer_id: mall.developers?.id?.toString() || "0", // Updated to use a non-empty string default value
      total_area: mall.total_area?.toString() || "",
      total_floors: mall.total_floors?.toString() || "",
      parking_spaces: mall.parking_spaces?.toString() || "",
      construction_status: mall.construction_status,
      completion_date: mall.completion_date || "",
    })
    setIsAddDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: {
        className: "falcon-badge warning",
        label: locale === "ar" ? "تخطيط" : "Planning",
      },
      under_construction: {
        className: "falcon-badge info",
        label: locale === "ar" ? "تحت الإنشاء" : "Under Construction",
      },
      completed: {
        className: "falcon-badge success",
        label: locale === "ar" ? "مكتمل" : "Completed",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planning
    return <span className={config.className}>{config.label}</span>
  }

  const filteredMalls = malls.filter((mall) => {
    const searchFields = [mall.ar_name, mall.en_name, mall.city, mall.district, mall.developers?.company_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || mall.construction_status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className={cn("falcon-dashboard", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "إدارة المولات" : "Mall Management"}
          subtitle={locale === "ar" ? "إدارة جميع المولات والمجمعات التجارية" : "Manage all malls and shopping centers"}
          locale={locale}
        />

        {/* Main content */}
        <main className="falcon-main p-6">
          {/* Stats Cards - Falcon Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "إجمالي المولات" : "Total Malls"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{malls.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "قيد الإنشاء" : "Under Construction"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {malls.filter((m) => m.construction_status === "under_construction").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-orange-600" />
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
                      {malls.filter((m) => m.construction_status === "completed").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "المساحة الإجمالية" : "Total Area"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {malls.reduce((sum, mall) => sum + (mall.total_area || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <CardHeader className="falcon-card-header">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="falcon-card-title flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    {locale === "ar" ? "المولات" : "Malls"}
                  </CardTitle>
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? `إجمالي ${malls.length} مول` : `Total ${malls.length} malls`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="falcon-btn-outline">
                    <Download className="h-4 w-4 mr-2" />
                    {locale === "ar" ? "تصدير" : "Export"}
                  </Button>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          resetForm()
                          setEditingMall(null)
                          setIsAddDialogOpen(true)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {locale === "ar" ? "إضافة مول" : "Add Mall"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900">
                          {editingMall
                            ? locale === "ar"
                              ? "تعديل مول"
                              : "Edit Mall"
                            : locale === "ar"
                              ? "إضافة مول جديد"
                              : "Add New Mall"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                          {locale === "ar"
                            ? "املأ النموذج أدناه لإضافة مول جديد"
                            : "Fill out the form below to add a new mall"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="ar_name" className="falcon-label">
                                {locale === "ar" ? "الاسم بالعربية" : "Arabic Name"}
                              </Label>
                              <Input
                                id="ar_name"
                                value={formData.ar_name}
                                onChange={(e) => setFormData({ ...formData, ar_name: e.target.value })}
                                className="falcon-input"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="en_name" className="falcon-label">
                                {locale === "ar" ? "الاسم بالإنجليزية" : "English Name"}
                              </Label>
                              <Input
                                id="en_name"
                                value={formData.en_name}
                                onChange={(e) => setFormData({ ...formData, en_name: e.target.value })}
                                className="falcon-input"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="description" className="falcon-label">
                              {locale === "ar" ? "الوصف" : "Description"}
                            </Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              className="falcon-textarea"
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor="address" className="falcon-label">
                              {locale === "ar" ? "العنوان" : "Address"}
                            </Label>
                            <Textarea
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              className="falcon-textarea"
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city" className="falcon-label">
                                {locale === "ar" ? "المدينة" : "City"}
                              </Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="falcon-input"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="district" className="falcon-label">
                                {locale === "ar" ? "الحي" : "District"}
                              </Label>
                              <Input
                                id="district"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                className="falcon-input"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="developer_id" className="falcon-label">
                              {locale === "ar" ? "المطور (اختياري)" : "Developer (Optional)"}
                            </Label>
                            <Select
                              value={formData.developer_id}
                              onValueChange={(value) => setFormData({ ...formData, developer_id: value })}
                            >
                              <SelectTrigger className="falcon-select">
                                <SelectValue
                                  placeholder={
                                    locale === "ar" ? "اختر المطور (اختياري)" : "Select developer (optional)"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">{locale === "ar" ? "بدون مطور" : "No developer"}</SelectItem>
                                {developers.map((developer) => (
                                  <SelectItem key={developer.id} value={developer.id.toString()}>
                                    {developer.company_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="total_area" className="falcon-label">
                                {locale === "ar" ? "المساحة الإجمالية (م²)" : "Total Area (m²)"}
                              </Label>
                              <Input
                                id="total_area"
                                type="number"
                                value={formData.total_area}
                                onChange={(e) => setFormData({ ...formData, total_area: e.target.value })}
                                className="falcon-input"
                              />
                            </div>
                            <div>
                              <Label htmlFor="total_floors" className="falcon-label">
                                {locale === "ar" ? "عدد الطوابق" : "Total Floors"}
                              </Label>
                              <Input
                                id="total_floors"
                                type="number"
                                value={formData.total_floors}
                                onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
                                className="falcon-input"
                              />
                            </div>
                            <div>
                              <Label htmlFor="parking_spaces" className="falcon-label">
                                {locale === "ar" ? "مواقف السيارات" : "Parking Spaces"}
                              </Label>
                              <Input
                                id="parking_spaces"
                                type="number"
                                value={formData.parking_spaces}
                                onChange={(e) => setFormData({ ...formData, parking_spaces: e.target.value })}
                                className="falcon-input"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="construction_status" className="falcon-label">
                                {locale === "ar" ? "حالة الإنشاء" : "Construction Status"}
                              </Label>
                              <Select
                                value={formData.construction_status}
                                onValueChange={(value) => setFormData({ ...formData, construction_status: value })}
                              >
                                <SelectTrigger className="falcon-select">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="planning">{locale === "ar" ? "تخطيط" : "Planning"}</SelectItem>
                                  <SelectItem value="under_construction">
                                    {locale === "ar" ? "تحت الإنشاء" : "Under Construction"}
                                  </SelectItem>
                                  <SelectItem value="completed">{locale === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="completion_date" className="falcon-label">
                                {locale === "ar" ? "تاريخ الإنجاز" : "Completion Date"}
                              </Label>
                              <Input
                                id="completion_date"
                                type="date"
                                value={formData.completion_date}
                                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                                className="falcon-input"
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="falcon-btn-secondary"
                          >
                            {locale === "ar" ? "إلغاء" : "Cancel"}
                          </Button>
                          <Button type="submit" className="falcon-btn-primary">
                            {editingMall ? (locale === "ar" ? "تحديث" : "Update") : locale === "ar" ? "إضافة" : "Add"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="falcon-card-content">
              {/* Search and Filter - Falcon Style */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="falcon-search flex-1">
                  <Search className="falcon-search-icon" />
                  <Input
                    placeholder={locale === "ar" ? "البحث عن المولات..." : "Search malls..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="falcon-search-input text-slate-900"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 falcon-filter">
                    <Filter className="h-4 w-4 mr-2 text-slate-500" />
                    <SelectValue placeholder={locale === "ar" ? "تصفية حسب الحالة" : "Filter by status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === "ar" ? "جميع الحالات" : "All Status"}</SelectItem>
                    <SelectItem value="planning">{locale === "ar" ? "تخطيط" : "Planning"}</SelectItem>
                    <SelectItem value="under_construction">
                      {locale === "ar" ? "تحت الإنشاء" : "Under Construction"}
                    </SelectItem>
                    <SelectItem value="completed">{locale === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Malls Table - Falcon Style */}
              <div className="falcon-table-container">
                <Table className="falcon-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{locale === "ar" ? "اسم المول" : "Mall Name"}</TableHead>
                      <TableHead>{locale === "ar" ? "المطور" : "Developer"}</TableHead>
                      <TableHead>{locale === "ar" ? "الموقع" : "Location"}</TableHead>
                      <TableHead>{locale === "ar" ? "المساحة" : "Area"}</TableHead>
                      <TableHead>{locale === "ar" ? "الطوابق" : "Floors"}</TableHead>
                      <TableHead>{locale === "ar" ? "الحالة" : "Status"}</TableHead>
                      <TableHead>{locale === "ar" ? "تاريخ الإنشاء" : "Created"}</TableHead>
                      <TableHead className="text-right">{locale === "ar" ? "الإجراءات" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                        </TableCell>
                      </TableRow>
                    ) : filteredMalls.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "لا توجد مولات" : "No malls found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMalls.map((mall) => (
                        <TableRow key={mall.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold text-slate-900">
                                {locale === "ar" ? mall.ar_name : mall.en_name}
                              </div>
                              <div className="text-sm text-slate-500">
                                {locale === "ar" ? mall.en_name : mall.ar_name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700">{mall.developers?.company_name || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                              <div>
                                <div className="text-slate-900">{mall.city}</div>
                                {mall.district && <div className="text-sm text-slate-500">{mall.district}</div>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {mall.total_area ? `${mall.total_area.toLocaleString()} m²` : "-"}
                          </TableCell>
                          <TableCell className="text-slate-700">{mall.total_floors || "-"}</TableCell>
                          <TableCell>{getStatusBadge(mall.construction_status)}</TableCell>
                          <TableCell className="text-slate-700">
                            {new Date(mall.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="falcon-dropdown">
                                <DropdownMenuItem onClick={() => handleEdit(mall)} className="falcon-dropdown-item">
                                  <Edit className="mr-2 h-4 w-4" />
                                  {locale === "ar" ? "تعديل" : "Edit"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(mall.id)}
                                  className="falcon-dropdown-item text-red-600"
                                >
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
