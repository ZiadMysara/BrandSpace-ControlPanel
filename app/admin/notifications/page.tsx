"use client"

import * as React from "react"
import { Bell, Mail, CheckCircle, AlertCircle, Info, Plus, Download, Pencil, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: string
  related_id: number | null
  is_read: boolean
  created_at: string
  users?: { user_name: string; email: string }
}

interface User {
  id: number
  user_name: string
  email: string
}

export default function NotificationsPage() {
  const [locale, setLocale] = React.useState<"en" | "ar">("en")
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterType, setFilterType] = React.useState<string>("all")

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Notification | null>(null)
  const [form, setForm] = React.useState({
    user_id: "",
    title: "",
    message: "",
    type: "general",
    related_id: "",
  })

  const { toast } = useToast()

  React.useEffect(() => {
    fetchNotifications()
    fetchUsers()
  }, [])

  async function fetchNotifications() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("notifications")
        .select("*, users (user_name, email)")
        .order("created_at", { ascending: false })
      if (error) throw error
      setNotifications(data ?? [])
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function fetchUsers() {
    const { data, error } = await supabase.from("users").select("id, user_name, email").order("user_name")
    if (!error) setUsers(data ?? [])
  }

  function resetForm() {
    setForm({ user_id: "", title: "", message: "", type: "general", related_id: "" })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.user_id || !form.title || !form.message) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" })
      return
    }

    const payload = {
      user_id: Number(form.user_id),
      title: form.title,
      message: form.message,
      type: form.type,
      related_id: form.related_id ? Number(form.related_id) : null,
      is_read: false,
    }

    try {
      if (editing) {
        const { error } = await supabase.from("notifications").update(payload).eq("id", editing.id)
        if (error) throw error
        toast({ title: "Updated", description: "Notification updated successfully" })
      } else {
        const { error } = await supabase.from("notifications").insert(payload)
        if (error) throw error
        toast({ title: "Created", description: "Notification created successfully" })
      }
      setIsDialogOpen(false)
      setEditing(null)
      resetForm()
      fetchNotifications()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this notification?")) return
    const { error } = await supabase.from("notifications").delete().eq("id", id)
    if (error) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" })
    } else {
      fetchNotifications()
    }
  }

  async function markAsRead(id: number) {
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id)
    if (!error) fetchNotifications()
  }

  const filtered = React.useMemo(() => {
    return notifications.filter((n) => {
      const text = `${n.title} ${n.message} ${n.users?.user_name ?? ""} ${n.users?.email ?? ""}`.toLowerCase()
      const matchesSearch = text.includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || n.type === filterType
      return matchesSearch && matchesType
    })
  }, [notifications, searchTerm, filterType])

  function typeBadge(type: string) {
    const map = {
      inquiry: "bg-blue-100 text-blue-800",
      booking: "bg-green-100 text-green-800",
      payment: "bg-orange-100 text-orange-800",
      system: "bg-red-100 text-red-800",
      general: "bg-slate-100 text-slate-800",
    } as const
    return (
      <span className={cn("px-2 py-0.5 rounded text-xs font-medium", map[type as keyof typeof map])}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  function typeIcon(type: string) {
    switch (type) {
      case "inquiry":
        return <Mail className="h-4 w-4" />
      case "booking":
        return <CheckCircle className="h-4 w-4" />
      case "payment":
        return <AlertCircle className="h-4 w-4" />
      case "system":
        return <Info className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className={cn("min-h-screen bg-slate-50", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "إدارة الإشعارات" : "Notification Management"}
          subtitle={locale === "ar" ? "إدارة جميع إشعارات النظام" : "Manage all system notifications"}
          locale={locale}
        />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">
                      {locale === "ar" ? "إجمالي الإشعارات" : "Total Notifications"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{notifications.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{locale === "ar" ? "غير مقروءة" : "Unread"}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {notifications.filter((n) => !n.is_read).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{locale === "ar" ? "مقروءة" : "Read"}</p>
                    <p className="text-3xl font-bold text-slate-900">{notifications.filter((n) => n.is_read).length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{locale === "ar" ? "النظام" : "System"}</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {notifications.filter((n) => n.type === "system").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="falcon-card">
            <CardHeader className="falcon-card-header">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="falcon-card-title flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    {locale === "ar" ? "الإشعارات" : "Notifications"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ar"
                      ? `إجمالي ${notifications.length} إشعار`
                      : `Total ${notifications.length} notifications`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    {locale === "ar" ? "تصدير" : "Export"}
                  </Button>
                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={(o) => {
                      setIsDialogOpen(o)
                      if (!o) {
                        setEditing(null)
                        resetForm()
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {locale === "ar" ? "إضافة إشعار" : "Add Notification"}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>
                          {editing
                            ? locale === "ar"
                              ? "تعديل إشعار"
                              : "Edit Notification"
                            : locale === "ar"
                              ? "إضافة إشعار"
                              : "Add Notification"}
                        </DialogTitle>
                        <DialogDescription>
                          {locale === "ar" ? "املأ الحقول التالية" : "Fill in the fields below"}
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="user">{locale === "ar" ? "المستخدم" : "User"}</Label>
                          <Select value={form.user_id} onValueChange={(v) => setForm({ ...form, user_id: v })}>
                            <SelectTrigger>
                              <SelectValue placeholder={locale === "ar" ? "اختر المستخدم" : "Select user"} />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((u) => (
                                <SelectItem key={u.id} value={u.id.toString()}>
                                  {u.user_name} ({u.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">{locale === "ar" ? "العنوان" : "Title"}</Label>
                            <Input
                              id="title"
                              value={form.title}
                              onChange={(e) => setForm({ ...form, title: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">{locale === "ar" ? "النوع" : "Type"}</Label>
                            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inquiry">Inquiry</SelectItem>
                                <SelectItem value="booking">Booking</SelectItem>
                                <SelectItem value="payment">Payment</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="message">{locale === "ar" ? "الرسالة" : "Message"}</Label>
                          <Textarea
                            id="message"
                            rows={4}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="related">{locale === "ar" ? "معرف مرتبط" : "Related ID (optional)"}</Label>
                          <Input
                            id="related"
                            type="number"
                            value={form.related_id}
                            onChange={(e) => setForm({ ...form, related_id: e.target.value })}
                          />
                        </div>

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            {locale === "ar" ? "إلغاء" : "Cancel"}
                          </Button>
                          <Button type="submit">
                            {editing ? (locale === "ar" ? "تحديث" : "Update") : locale === "ar" ? "إضافة" : "Add"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>

            <CardContent className="falcon-card-content">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <Input
                  className="sm:max-w-xs text-slate-900 placeholder:text-black"
                  placeholder={locale === "ar" ? "بحث..." : "Search..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={locale === "ar" ? "الكل" : "All types"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === "ar" ? "الكل" : "All"}</SelectItem>
                    <SelectItem value="inquiry">Inquiry</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="py-2 px-3 text-left">#</th>
                      <th className="py-2 px-3 text-left">{locale === "ar" ? "العنوان" : "Title"}</th>
                      <th className="py-2 px-3 text-left">{locale === "ar" ? "الرسالة" : "Message"}</th>
                      <th className="py-2 px-3">{locale === "ar" ? "النوع" : "Type"}</th>
                      <th className="py-2 px-3">{locale === "ar" ? "الحالة" : "Status"}</th>
                      <th className="py-2 px-3">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-500">
                          Loading...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-500">
                          {locale === "ar" ? "لا توجد بيانات" : "No data"}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((n, idx) => (
                        <tr key={n.id} className="border-b last:border-none">
                          <td className="py-2 px-3">{idx + 1}</td>
                          <td className="py-2 px-3">{n.title}</td>
                          <td className="py-2 px-3">{n.message}</td>
                          <td className="py-2 px-3 text-center space-x-1 flex items-center justify-center">
                            {typeIcon(n.type)}
                            {typeBadge(n.type)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {n.is_read ? (
                              <span className="text-green-600">{locale === "ar" ? "مقروءة" : "Read"}</span>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => markAsRead(n.id)}>
                                {locale === "ar" ? "وضع مقروء" : "Mark as read"}
                              </Button>
                            )}
                          </td>
                          <td className="py-2 px-3 flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditing(n)
                                setForm({
                                  user_id: n.user_id.toString(),
                                  title: n.title,
                                  message: n.message,
                                  type: n.type,
                                  related_id: n.related_id?.toString() ?? "",
                                })
                                setIsDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(n.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
