"use client"

import { useState } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Shield, Database, Palette, Save, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SystemSettings {
  siteName: string
  siteDescription: string
  adminEmail: string
  supportEmail: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  autoBackup: boolean
  backupFrequency: string
  maxFileSize: number
  allowedFileTypes: string[]
  theme: string
  language: string
  timezone: string
}

export default function SettingsPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Brandspace Admin",
    siteDescription: "Mall and shop management platform",
    adminEmail: "admin@brandspace.com",
    supportEmail: "support@brandspace.com",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    backupFrequency: "daily",
    maxFileSize: 10,
    allowedFileTypes: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
    theme: "light",
    language: "en",
    timezone: "UTC",
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: locale === "ar" ? "تم الحفظ بنجاح" : "Settings Saved",
        description: locale === "ar" ? "تم حفظ الإعدادات بنجاح" : "Your settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: locale === "ar" ? "حدث خطأ أثناء حفظ الإعدادات" : "An error occurred while saving settings.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      siteName: "Brandspace Admin",
      siteDescription: "Mall and shop management platform",
      adminEmail: "admin@brandspace.com",
      supportEmail: "support@brandspace.com",
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true,
      smsNotifications: false,
      autoBackup: true,
      backupFrequency: "daily",
      maxFileSize: 10,
      allowedFileTypes: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
      theme: "light",
      language: "en",
      timezone: "UTC",
    })

    toast({
      title: locale === "ar" ? "تم الإعادة تعيين" : "Settings Reset",
      description:
        locale === "ar"
          ? "تم إعادة تعيين الإعدادات إلى القيم الافتراضية"
          : "Settings have been reset to default values.",
    })
  }

  return (
    <div className={cn("falcon-dashboard", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "الإعدادات" : "Settings"}
          subtitle={locale === "ar" ? "إدارة إعدادات النظام والتكوين" : "Manage system settings and configuration"}
          locale={locale}
        />

        <main className="falcon-main p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {locale === "ar" ? "تكوين النظام" : "System Configuration"}
              </h2>
              <p className="text-sm text-slate-600">
                {locale === "ar" ? "إدارة الإعدادات العامة للنظام" : "Manage general system settings"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" className="falcon-btn-outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                {locale === "ar" ? "إعادة تعيين" : "Reset"}
              </Button>
              <Button onClick={handleSave} disabled={saving} className="falcon-btn-primary">
                <Save className="w-4 h-4 mr-2" />
                {saving ? (locale === "ar" ? "جاري الحفظ..." : "Saving...") : locale === "ar" ? "حفظ" : "Save"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="falcon-tabs-list">
              <TabsTrigger value="general">{locale === "ar" ? "عام" : "General"}</TabsTrigger>
              <TabsTrigger value="notifications">{locale === "ar" ? "الإشعارات" : "Notifications"}</TabsTrigger>
              <TabsTrigger value="security">{locale === "ar" ? "الأمان" : "Security"}</TabsTrigger>
              <TabsTrigger value="system">{locale === "ar" ? "النظام" : "System"}</TabsTrigger>
              <TabsTrigger value="appearance">{locale === "ar" ? "المظهر" : "Appearance"}</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    {locale === "ar" ? "الإعدادات العامة" : "General Settings"}
                  </CardTitle>
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? "إعدادات الموقع الأساسية" : "Basic site configuration"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="falcon-card-content space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="siteName" className="falcon-label">
                        {locale === "ar" ? "اسم الموقع" : "Site Name"}
                      </Label>
                      <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                        className="falcon-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminEmail" className="falcon-label">
                        {locale === "ar" ? "بريد المدير" : "Admin Email"}
                      </Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => setSettings((prev) => ({ ...prev, adminEmail: e.target.value }))}
                        className="falcon-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription" className="falcon-label">
                      {locale === "ar" ? "وصف الموقع" : "Site Description"}
                    </Label>
                    <Textarea
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
                      className="falcon-textarea"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail" className="falcon-label">
                        {locale === "ar" ? "بريد الدعم" : "Support Email"}
                      </Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))}
                        className="falcon-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="falcon-label">
                        {locale === "ar" ? "المنطقة الزمنية" : "Timezone"}
                      </Label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}
                      >
                        <SelectTrigger className="falcon-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                          <SelectItem value="Asia/Riyadh">Riyadh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="falcon-label">{locale === "ar" ? "وضع الصيانة" : "Maintenance Mode"}</Label>
                        <p className="text-sm text-slate-500">
                          {locale === "ar" ? "تعطيل الوصول للمستخدمين مؤقتاً" : "Temporarily disable user access"}
                        </p>
                      </div>
                      <Switch
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, maintenanceMode: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="falcon-label">
                          {locale === "ar" ? "تفعيل التسجيل" : "Registration Enabled"}
                        </Label>
                        <p className="text-sm text-slate-500">
                          {locale === "ar" ? "السماح للمستخدمين الجدد بالتسجيل" : "Allow new users to register"}
                        </p>
                      </div>
                      <Switch
                        checked={settings.registrationEnabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, registrationEnabled: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    {locale === "ar" ? "إعدادات الإشعارات" : "Notification Settings"}
                  </CardTitle>
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? "إدارة إشعارات النظام" : "Manage system notifications"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="falcon-card-content space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="falcon-label">
                        {locale === "ar" ? "إشعارات البريد الإلكتروني" : "Email Notifications"}
                      </Label>
                      <p className="text-sm text-slate-500">
                        {locale === "ar" ? "إرسال إشعارات عبر البريد الإلكتروني" : "Send notifications via email"}
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="falcon-label">
                        {locale === "ar" ? "إشعارات الرسائل النصية" : "SMS Notifications"}
                      </Label>
                      <p className="text-sm text-slate-500">
                        {locale === "ar" ? "إرسال إشعارات عبر الرسائل النصية" : "Send notifications via SMS"}
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {locale === "ar" ? "إعدادات الأمان" : "Security Settings"}
                  </CardTitle>
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? "إعدادات الأمان والحماية" : "Security and protection settings"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="falcon-card-content space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize" className="falcon-label">
                      {locale === "ar" ? "الحد الأقصى لحجم الملف (MB)" : "Max File Size (MB)"}
                    </Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, maxFileSize: Number.parseInt(e.target.value) }))
                      }
                      className="falcon-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="falcon-label">
                      {locale === "ar" ? "أنواع الملفات المسموحة" : "Allowed File Types"}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {settings.allowedFileTypes.map((type, index) => (
                        <span key={index} className="falcon-badge">
                          .{type}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    {locale === "ar" ? "إعدادات النظام" : "System Settings"}
                  </CardTitle>
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? "إعدادات النسخ الاحتياطي والنظام" : "Backup and system configuration"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="falcon-card-content space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="falcon-label">
                        {locale === "ar" ? "النسخ الاحتياطي التلقائي" : "Auto Backup"}
                      </Label>
                      <p className="text-sm text-slate-500">
                        {locale === "ar" ? "إنشاء نسخ احتياطية تلقائياً" : "Automatically create backups"}
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoBackup: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency" className="falcon-label">
                      {locale === "ar" ? "تكرار النسخ الاحتياطي" : "Backup Frequency"}
                    </Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, backupFrequency: value }))}
                    >
                      <SelectTrigger className="falcon-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">{locale === "ar" ? "كل ساعة" : "Hourly"}</SelectItem>
                        <SelectItem value="daily">{locale === "ar" ? "يومياً" : "Daily"}</SelectItem>
                        <SelectItem value="weekly">{locale === "ar" ? "أسبوعياً" : "Weekly"}</SelectItem>
                        <SelectItem value="monthly">{locale === "ar" ? "شهرياً" : "Monthly"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    {locale === "ar" ? "إعدادات المظهر" : "Appearance Settings"}
                  </CardTitle>
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? "تخصيص مظهر النظام" : "Customize system appearance"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="falcon-card-content space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme" className="falcon-label">
                        {locale === "ar" ? "المظهر" : "Theme"}
                      </Label>
                      <Select
                        value={settings.theme}
                        onValueChange={(value) => setSettings((prev) => ({ ...prev, theme: value }))}
                      >
                        <SelectTrigger className="falcon-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">{locale === "ar" ? "فاتح" : "Light"}</SelectItem>
                          <SelectItem value="dark">{locale === "ar" ? "داكن" : "Dark"}</SelectItem>
                          <SelectItem value="system">{locale === "ar" ? "النظام" : "System"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language" className="falcon-label">
                        {locale === "ar" ? "اللغة" : "Language"}
                      </Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger className="falcon-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
