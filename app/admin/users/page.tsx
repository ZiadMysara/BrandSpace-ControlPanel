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
  Users,
  UserCheck,
  UserX,
  Shield,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  user_name: string
  email: string
  phone: string
  user_type: number
  user_position: number
  is_active: boolean
  created_at: string
  user_types?: { type_en_name: string; type_ar_name: string }
  user_positions?: { position_en_name: string; position_ar_name: string }
}

interface UserType {
  id: number
  type_en_name: string
  type_ar_name: string
}

interface UserPosition {
  id: number
  position_en_name: string
  position_ar_name: string
}

export default function UsersPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [users, setUsers] = useState<User[]>([])
  const [userTypes, setUserTypes] = useState<UserType[]>([])
  const [userPositions, setUserPositions] = useState<UserPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    phone: "",
    user_type: "",
    user_position: "",
    password: "",
  })

  const { toast } = useToast()

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from("user_types").select("count").limit(1)
      console.log("Supabase connection test:", { data, error })
      if (error) {
        toast({
          title: "Database Connection Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Connection test failed:", error)
    }
  }

  useEffect(() => {
    testSupabaseConnection()
    fetchUsers()
    fetchUserTypes()
    fetchUserPositions()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("users")
        .select(`
          *,
          user_types (type_en_name, type_ar_name),
          user_positions (position_en_name, position_ar_name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUserTypes = async () => {
    try {
      const { data, error } = await supabase.from("user_types").select("*").order("type_en_name")

      if (error) throw error
      setUserTypes(data || [])
    } catch (error) {
      console.error("Error fetching user types:", error)
    }
  }

  const fetchUserPositions = async () => {
    try {
      const { data, error } = await supabase.from("user_positions").select("*").order("position_en_name")

      if (error) throw error
      setUserPositions(data || [])
    } catch (error) {
      console.error("Error fetching user positions:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      console.log("Submitting form data:", formData)

      // Validate required fields
      if (!formData.user_name || !formData.email || !formData.user_type) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      if (!editingUser && !formData.password) {
        toast({
          title: "Validation Error",
          description: "Password is required for new users",
          variant: "destructive",
        })
        return
      }

      const userData = {
        user_name: formData.user_name,
        email: formData.email,
        phone: formData.phone || null,
        user_type: Number.parseInt(formData.user_type),
        user_position: formData.user_position ? Number.parseInt(formData.user_position) : null,
        password_hash: formData.password || "temp_password_hash", // In real app, hash this properly
        is_active: true,
      }

      console.log("Prepared user data:", userData)

      if (editingUser) {
        const { data, error } = await supabase.from("users").update(userData).eq("id", editingUser.id).select()

        console.log("Update result:", { data, error })

        if (error) {
          console.error("Update error:", error)
          throw error
        }

        toast({
          title: "Success",
          description: "User updated successfully",
        })
      } else {
        const { data, error } = await supabase.from("users").insert([userData]).select()

        console.log("Insert result:", { data, error })

        if (error) {
          console.error("Insert error:", error)
          throw error
        }

        toast({
          title: "Success",
          description: "User created successfully",
        })
      }

      setIsAddDialogOpen(false)
      setEditingUser(null)
      setFormData({
        user_name: "",
        email: "",
        phone: "",
        user_type: "",
        user_position: "",
        password: "",
      })
      fetchUsers()
    } catch (error: any) {
      console.error("Error saving user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) throw error

      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      user_name: user.user_name,
      email: user.email,
      phone: user.phone || "",
      user_type: user.user_type.toString(),
      user_position: user.user_position?.toString() || "",
      password: "",
    })
    setIsAddDialogOpen(true)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || user.user_type.toString() === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="sidebar-layout">
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className="sidebar-content">
        <FalconHeader
          title={locale === "ar" ? "إدارة المستخدمين" : "User Management"}
          subtitle={
            locale === "ar" ? "إدارة جميع المستخدمين والمديرين في النظام" : "Manage all users and admins in the system"
          }
          locale={locale}
        />

        {/* Main content */}
        <main className="falcon-main p-6">
          {/* Stats Cards */}
          <div className="falcon-grid falcon-grid-4 mb-6">
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "إجمالي المستخدمين" : "Total Users"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{users.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "المستخدمين النشطين" : "Active Users"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{users.filter((u) => u.is_active).length}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "المستخدمين غير النشطين" : "Inactive Users"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{users.filter((u) => !u.is_active).length}</p>
                  </div>
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <UserX className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{locale === "ar" ? "المديرين" : "Admins"}</p>
                    <p className="text-3xl font-bold text-slate-900">{users.filter((u) => u.user_type === 1).length}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
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
                    <Users className="mr-2 h-5 w-5" />
                    {locale === "ar" ? "المستخدمين" : "Users"}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {locale === "ar" ? `إجمالي ${users.length} مستخدم` : `Total ${users.length} users`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50">
                    <Download className="h-4 w-4 mr-2" />
                    {locale === "ar" ? "تصدير" : "Export"}
                  </Button>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {locale === "ar" ? "إضافة مستخدم" : "Add User"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900">
                          {editingUser
                            ? locale === "ar"
                              ? "تعديل مستخدم"
                              : "Edit User"
                            : locale === "ar"
                              ? "إضافة مستخدم جديد"
                              : "Add New User"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                          {locale === "ar"
                            ? "املأ النموذج أدناه لإضافة مستخدم جديد"
                            : "Fill out the form below to add a new user"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="user_name" className="text-right text-slate-700">
                              {locale === "ar" ? "الاسم" : "Name"}
                            </Label>
                            <Input
                              id="user_name"
                              value={formData.user_name}
                              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                              className="col-span-3 border-slate-200 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right text-slate-700">
                              {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="col-span-3 border-slate-200 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right text-slate-700">
                              {locale === "ar" ? "الهاتف" : "Phone"}
                            </Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="col-span-3 border-slate-200 focus:border-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="user_type" className="text-right text-slate-700">
                              {locale === "ar" ? "نوع المستخدم" : "User Type"}
                            </Label>
                            <Select
                              value={formData.user_type}
                              onValueChange={(value) => setFormData({ ...formData, user_type: value })}
                            >
                              <SelectTrigger className="col-span-3 border-slate-200 focus:border-blue-500">
                                <SelectValue placeholder={locale === "ar" ? "اختر النوع" : "Select type"} />
                              </SelectTrigger>
                              <SelectContent>
                                {userTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id.toString()}>
                                    {locale === "ar" ? type.type_ar_name : type.type_en_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="user_position" className="text-right text-slate-700">
                              {locale === "ar" ? "المنصب" : "Position"}
                            </Label>
                            <Select
                              value={formData.user_position}
                              onValueChange={(value) => setFormData({ ...formData, user_position: value })}
                            >
                              <SelectTrigger className="col-span-3 border-slate-200 focus:border-blue-500">
                                <SelectValue placeholder={locale === "ar" ? "اختر المنصب" : "Select position"} />
                              </SelectTrigger>
                              <SelectContent>
                                {userPositions.map((position) => (
                                  <SelectItem key={position.id} value={position.id.toString()}>
                                    {locale === "ar" ? position.position_ar_name : position.position_en_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {!editingUser && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="password" className="text-right text-slate-700">
                                {locale === "ar" ? "كلمة المرور" : "Password"}
                              </Label>
                              <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="col-span-3 border-slate-200 focus:border-blue-500"
                                required={!editingUser}
                              />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            {editingUser ? (locale === "ar" ? "تحديث" : "Update") : locale === "ar" ? "إضافة" : "Add"}
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
                    placeholder={locale === "ar" ? "البحث عن المستخدمين..." : "Search users..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white text-slate-900"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48 border-slate-200 focus:border-blue-500 bg-white hover:bg-slate-50">
                    <Filter className="h-4 w-4 mr-2 text-slate-500" />
                    <SelectValue placeholder={locale === "ar" ? "تصفية حسب النوع" : "Filter by type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === "ar" ? "جميع الأنواع" : "All Types"}</SelectItem>
                    {userTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {locale === "ar" ? type.type_ar_name : type.type_en_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="falcon-table-container">
                <Table className="falcon-table">
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "الاسم" : "Name"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "الهاتف" : "Phone"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "النوع" : "Type"}
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        {locale === "ar" ? "المنصب" : "Position"}
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
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                          {locale === "ar" ? "لا توجد مستخدمين" : "No users found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-900">{user.user_name}</TableCell>
                          <TableCell className="text-slate-700">{user.email}</TableCell>
                          <TableCell className="text-slate-700">{user.phone || "-"}</TableCell>
                          <TableCell>
                            <span className="falcon-badge bg-blue-100 text-blue-800">
                              {locale === "ar" ? user.user_types?.type_ar_name : user.user_types?.type_en_name}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {user.user_positions
                              ? locale === "ar"
                                ? user.user_positions.position_ar_name
                                : user.user_positions.position_en_name
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <span className={user.is_active ? "falcon-badge success" : "falcon-badge danger"}>
                              {user.is_active
                                ? locale === "ar"
                                  ? "نشط"
                                  : "Active"
                                : locale === "ar"
                                  ? "غير نشط"
                                  : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {new Date(user.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(user)} className="text-slate-700">
                                  <Edit className="mr-2 h-4 w-4" />
                                  {locale === "ar" ? "تعديل" : "Edit"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
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