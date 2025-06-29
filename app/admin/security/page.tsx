"use client"

import { useState, useEffect } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { FalconMetricCard } from "@/components/falcon-metric-card"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Key,
  UserCheck,
  Activity,
  Globe,
  Smartphone,
  Monitor,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SecurityEvent {
  id: number
  type: "login" | "failed_login" | "password_change" | "permission_change"
  user: string
  ip: string
  location: string
  device: string
  timestamp: string
  status: "success" | "failed" | "warning"
}

interface ActiveSession {
  id: number
  user: string
  ip: string
  location: string
  device: string
  lastActivity: string
  current: boolean
}

export default function SecurityPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [loading, setLoading] = useState(true)
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: true,
    sessionTimeout: true,
    ipWhitelist: false,
    auditLogging: true,
    emailAlerts: true,
  })
  const { toast } = useToast()

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: 1,
      type: "login",
      user: "admin@brandspace.com",
      ip: "192.168.1.100",
      location: "Riyadh, SA",
      device: "Chrome on Windows",
      timestamp: "2024-01-15 14:30:00",
      status: "success",
    },
    {
      id: 2,
      type: "failed_login",
      user: "unknown@example.com",
      ip: "45.123.45.67",
      location: "Unknown",
      device: "Firefox on Linux",
      timestamp: "2024-01-15 14:25:00",
      status: "failed",
    },
    {
      id: 3,
      type: "password_change",
      user: "user@brandspace.com",
      ip: "192.168.1.105",
      location: "Jeddah, SA",
      device: "Safari on macOS",
      timestamp: "2024-01-15 13:45:00",
      status: "success",
    },
  ])

  const [activeSessions] = useState<ActiveSession[]>([
    {
      id: 1,
      user: "admin@brandspace.com",
      ip: "192.168.1.100",
      location: "Riyadh, SA",
      device: "Chrome on Windows",
      lastActivity: "2 minutes ago",
      current: true,
    },
    {
      id: 2,
      user: "admin@brandspace.com",
      ip: "192.168.1.105",
      location: "Riyadh, SA",
      device: "Safari on iPhone",
      lastActivity: "1 hour ago",
      current: false,
    },
  ])

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleSecuritySettingChange = (setting: string, value: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }))
    toast({
      title: locale === "ar" ? "تم التحديث" : "Updated",
      description: locale === "ar" ? "تم تحديث إعدادات الأمان بنجاح" : "Security settings updated successfully",
    })
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <UserCheck className="h-4 w-4 text-green-600" />
      case "failed_login":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "password_change":
        return <Key className="h-4 w-4 text-blue-600" />
      case "permission_change":
        return <Shield className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="falcon-badge success">Success</Badge>
      case "failed":
        return <Badge className="falcon-badge danger">Failed</Badge>
      case "warning":
        return <Badge className="falcon-badge warning">Warning</Badge>
      default:
        return <Badge className="falcon-badge">Unknown</Badge>
    }
  }

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Android")) {
      return <Smartphone className="h-4 w-4 text-slate-500" />
    }
    if (device.includes("Windows") || device.includes("macOS") || device.includes("Linux")) {
      return <Monitor className="h-4 w-4 text-slate-500" />
    }
    return <Globe className="h-4 w-4 text-slate-500" />
  }

  return (
    <div className={cn("falcon-dashboard", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "الأمان" : "Security"}
          subtitle={locale === "ar" ? "إدارة أمان النظام والمراقبة" : "Manage system security and monitoring"}
          locale={locale}
        />

        <main className="falcon-main p-6">
          {/* Security Metrics */}
          <div className="falcon-grid falcon-grid-4 mb-8">
            <FalconMetricCard
              title={locale === "ar" ? "محاولات تسجيل الدخول" : "Login Attempts"}
              value="1,247"
              change={{ value: "+5.2%", type: "positive" }}
              icon={UserCheck}
              iconColor="text-blue-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "محاولات فاشلة" : "Failed Attempts"}
              value="23"
              change={{ value: "-12.3%", type: "positive" }}
              icon={XCircle}
              iconColor="text-red-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "الجلسات النشطة" : "Active Sessions"}
              value="156"
              change={{ value: "+8.1%", type: "positive" }}
              icon={Activity}
              iconColor="text-green-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "التهديدات المحجوبة" : "Blocked Threats"}
              value="45"
              change={{ value: "-25.4%", type: "positive" }}
              icon={Shield}
              iconColor="text-orange-600"
            />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="falcon-tabs-list">
              <TabsTrigger value="overview">{locale === "ar" ? "نظرة عامة" : "Overview"}</TabsTrigger>
              <TabsTrigger value="events">{locale === "ar" ? "أحداث الأمان" : "Security Events"}</TabsTrigger>
              <TabsTrigger value="sessions">{locale === "ar" ? "الجلسات" : "Sessions"}</TabsTrigger>
              <TabsTrigger value="settings">{locale === "ar" ? "الإعدادات" : "Settings"}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="falcon-grid falcon-grid-2">
                <Card className="falcon-card">
                  <CardHeader className="falcon-card-header">
                    <CardTitle className="falcon-card-title flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      {locale === "ar" ? "حالة الأمان" : "Security Status"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="falcon-card-content">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-sm">{locale === "ar" ? "المصادقة الثنائية" : "Two-Factor Auth"}</span>
                        </div>
                        <Badge className="falcon-badge success">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-sm">{locale === "ar" ? "تشفير SSL" : "SSL Encryption"}</span>
                        </div>
                        <Badge className="falcon-badge success">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                          <span className="text-sm">{locale === "ar" ? "انتهاء كلمات المرور" : "Password Expiry"}</span>
                        </div>
                        <Badge className="falcon-badge warning">Warning</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <XCircle className="h-5 w-5 text-red-600 mr-2" />
                          <span className="text-sm">{locale === "ar" ? "قائمة IP البيضاء" : "IP Whitelist"}</span>
                        </div>
                        <Badge className="falcon-badge danger">Inactive</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="falcon-card">
                  <CardHeader className="falcon-card-header">
                    <CardTitle className="falcon-card-title flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      {locale === "ar" ? "التنبيهات الأخيرة" : "Recent Alerts"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="falcon-card-content">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {locale === "ar" ? "محاولة دخول مشبوهة" : "Suspicious login attempt"}
                          </p>
                          <p className="text-xs text-slate-500">IP: 45.123.45.67 - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {locale === "ar" ? "كلمة مرور ضعيفة" : "Weak password detected"}
                          </p>
                          <p className="text-xs text-slate-500">User: user@example.com - 4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {locale === "ar" ? "تحديث الصلاحيات" : "Permission updated"}
                          </p>
                          <p className="text-xs text-slate-500">Admin: admin@brandspace.com - 6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title">
                    {locale === "ar" ? "سجل أحداث الأمان" : "Security Events Log"}
                  </CardTitle>
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? "جميع أحداث الأمان الأخيرة" : "All recent security events"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="falcon-card-content">
                  <div className="falcon-table-container">
                    <Table className="falcon-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>{locale === "ar" ? "النوع" : "Type"}</TableHead>
                          <TableHead>{locale === "ar" ? "المستخدم" : "User"}</TableHead>
                          <TableHead>{locale === "ar" ? "عنوان IP" : "IP Address"}</TableHead>
                          <TableHead>{locale === "ar" ? "الموقع" : "Location"}</TableHead>
                          <TableHead>{locale === "ar" ? "الجهاز" : "Device"}</TableHead>
                          <TableHead>{locale === "ar" ? "الوقت" : "Time"}</TableHead>
                          <TableHead>{locale === "ar" ? "الحالة" : "Status"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {securityEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>
                              <div className="flex items-center">
                                {getEventIcon(event.type)}
                                <span className="ml-2 text-sm capitalize">{event.type.replace("_", " ")}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{event.user}</TableCell>
                            <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getDeviceIcon(event.device)}
                                <span className="ml-2 text-sm">{event.device}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{event.timestamp}</TableCell>
                            <TableCell>{getStatusBadge(event.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title">
                    {locale === "ar" ? "الجلسات النشطة" : "Active Sessions"}
                  </CardTitle>
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? "إدارة جلسات المستخدمين النشطة" : "Manage active user sessions"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="falcon-card-content">
                  <div className="falcon-table-container">
                    <Table className="falcon-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>{locale === "ar" ? "المستخدم" : "User"}</TableHead>
                          <TableHead>{locale === "ar" ? "عنوان IP" : "IP Address"}</TableHead>
                          <TableHead>{locale === "ar" ? "الموقع" : "Location"}</TableHead>
                          <TableHead>{locale === "ar" ? "الجهاز" : "Device"}</TableHead>
                          <TableHead>{locale === "ar" ? "آخر نشاط" : "Last Activity"}</TableHead>
                          <TableHead>{locale === "ar" ? "الإجراءات" : "Actions"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {session.current && <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>}
                                {session.user}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{session.ip}</TableCell>
                            <TableCell>{session.location}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getDeviceIcon(session.device)}
                                <span className="ml-2 text-sm">{session.device}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{session.lastActivity}</TableCell>
                            <TableCell>
                              {!session.current && (
                                <Button variant="outline" size="sm" className="falcon-btn-outline">
                                  {locale === "ar" ? "إنهاء الجلسة" : "End Session"}
                                </Button>
                              )}
                              {session.current && <Badge className="falcon-badge info">Current</Badge>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <Card className="falcon-card">
                  <CardHeader className="falcon-card-header">
                    <CardTitle className="falcon-card-title">
                      {locale === "ar" ? "إعدادات الأمان" : "Security Settings"}
                    </CardTitle>
                    <CardDescription className="falcon-card-description">
                      {locale === "ar" ? "تكوين إعدادات الأمان للنظام" : "Configure system security settings"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="falcon-card-content space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          {locale === "ar" ? "المصادقة الثنائية" : "Two-Factor Authentication"}
                        </Label>
                        <p className="text-sm text-slate-500">
                          {locale === "ar" ? "تفعيل المصادقة الثنائية لجميع المستخدمين" : "Enable 2FA for all users"}
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => handleSecuritySettingChange("twoFactorAuth", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          {locale === "ar" ? "انتهاء كلمة المرور" : "Password Expiry"}
                        </Label>
                        <p className="text-sm text-slate-500">
                          {locale === "ar"
                            ? "إجبار المستخدمين على تغيير كلمات المرور دورياً"
                            : "Force users to change passwords periodically"}
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.passwordExpiry}
                        onCheckedChange={(checked) => handleSecuritySettingChange("passwordExpiry", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">{locale === "ar" ? "انتهاء الجلسة" : "Session Timeout"}</Label>
                        <p className="text-sm text-slate-500">
                          {locale === "ar"
                            ? "إنهاء الجلسات تلقائياً بعد فترة عدم نشاط"
                            : "Automatically end sessions after inactivity"}
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.sessionTimeout}
                        onCheckedChange={(checked) => handleSecuritySettingChange("sessionTimeout", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">{locale === "ar" ? "قائمة IP البيضاء" : "IP Whitelist"}</Label>
                        <p className="text-sm text-slate-500">
                          {locale === "ar"
                            ? "السماح بالوصول من عناوين IP محددة فقط"
                            : "Allow access only from specific IP addresses"}
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.ipWhitelist}
                        onCheckedChange={(checked) => handleSecuritySettingChange("ipWhitelist", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">{locale === "ar" ? "سجل التدقيق" : "Audit Logging"}</Label>
                        <p className="text-sm text-slate-500">
                          {locale === "ar"
                            ? "تسجيل جميع أنشطة النظام للمراجعة"
                            : "Log all system activities for review"}
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.auditLogging}
                        onCheckedChange={(checked) => handleSecuritySettingChange("auditLogging", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          {locale === "ar" ? "تنبيهات البريد الإلكتروني" : "Email Alerts"}
                        </Label>
                        <p className="text-sm text-slate-500">
                          {locale === "ar"
                            ? "إرسال تنبيهات الأمان عبر البريد الإلكتروني"
                            : "Send security alerts via email"}
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.emailAlerts}
                        onCheckedChange={(checked) => handleSecuritySettingChange("emailAlerts", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
