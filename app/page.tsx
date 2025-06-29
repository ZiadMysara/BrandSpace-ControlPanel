"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Store,
  Users,
  TrendingUp,
  ArrowRight,
  MapPin,
  Shield,
  Zap,
  Globe,
  Phone,
  Mail,
  CheckCircle,
} from "lucide-react"

const features = [
  {
    icon: Building2,
    title: "Mall Management",
    titleAr: "إدارة المولات",
    description: "Comprehensive mall and property management system",
    descriptionAr: "نظام شامل لإدارة المولات والعقارات",
  },
  {
    icon: Store,
    title: "Shop Listings",
    titleAr: "قوائم المتاجر",
    description: "Advanced shop listing and booking platform",
    descriptionAr: "منصة متقدمة لإدراج وحجز المتاجر",
  },
  {
    icon: Users,
    title: "User Management",
    titleAr: "إدارة المستخدمين",
    description: "Multi-role user management with permissions",
    descriptionAr: "إدارة المستخدمين متعددة الأدوار مع الصلاحيات",
  },
  {
    icon: TrendingUp,
    title: "Analytics & Reports",
    titleAr: "التحليلات والتقارير",
    description: "Real-time analytics and comprehensive reporting",
    descriptionAr: "تحليلات فورية وتقارير شاملة",
  },
]

const stats = [
  { value: "12+", label: "Active Malls", labelAr: "مول نشط" },
  { value: "248+", label: "Listed Shops", labelAr: "متجر مدرج" },
  { value: "1,429+", label: "Registered Users", labelAr: "مستخدم مسجل" },
  { value: "87%", label: "Occupancy Rate", labelAr: "معدل الإشغال" },
]

export default function HomePage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 p-1">
                <Image
                  src="/brandspace-logo.jpeg"
                  alt="BrandSpace"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1a365d]">BrandSpace</h1>
                <p className="text-xs text-slate-600">Real Estate Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-[#1a365d] transition-colors">
                {locale === "ar" ? "المميزات" : "Features"}
              </a>
              <a href="#about" className="text-slate-600 hover:text-[#1a365d] transition-colors">
                {locale === "ar" ? "حولنا" : "About"}
              </a>
              <a href="#contact" className="text-slate-600 hover:text-[#1a365d] transition-colors">
                {locale === "ar" ? "اتصل بنا" : "Contact"}
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocale(locale === "en" ? "ar" : "en")}
                className="text-slate-600 hover:text-[#1a365d]"
              >
                <Globe className="h-4 w-4 mr-2" />
                {locale === "en" ? "العربية" : "English"}
              </Button>
              <Link href="/admin">
                <Button className="bg-[#1a365d] hover:bg-[#2c5282] text-white">
                  {locale === "ar" ? "لوحة التحكم" : "Admin Panel"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#1a365d] text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Zap className="h-3 w-3 mr-1" />
              {locale === "ar" ? "منصة متطورة للعقارات التجارية" : "Advanced Commercial Real Estate Platform"}
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {locale === "ar" ? (
                <>
                  منصة <span className="text-[#e53e3e]">BrandSpace</span>
                  <br />
                  لإدارة المساحات التجارية
                </>
              ) : (
                <>
                  <span className="text-[#e53e3e]">BrandSpace</span> Platform
                  <br />
                  for Commercial Spaces
                </>
              )}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {locale === "ar"
                ? "منصة شاملة لإدارة المولات والمساحات التجارية مع أدوات متقدمة للمطورين والمستثمرين"
                : "Comprehensive platform for managing malls and commercial spaces with advanced tools for developers and investors"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin">
                <Button size="lg" className="bg-[#e53e3e] hover:bg-red-600 text-white px-8">
                  {locale === "ar" ? "ابدأ الآن" : "Get Started"}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1a365d] bg-transparent"
              >
                {locale === "ar" ? "شاهد العرض التوضيحي" : "Watch Demo"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-[#1a365d] mb-2">{stat.value}</div>
                <div className="text-slate-600">{locale === "ar" ? stat.labelAr : stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a365d] mb-4">
              {locale === "ar" ? "مميزات المنصة" : "Platform Features"}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {locale === "ar"
                ? "اكتشف الأدوات المتقدمة التي تجعل إدارة المساحات التجارية أسهل وأكثر فعالية"
                : "Discover advanced tools that make commercial space management easier and more efficient"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#2c5282] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-[#1a365d]">
                      {locale === "ar" ? feature.titleAr : feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-slate-600">
                      {locale === "ar" ? feature.descriptionAr : feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {locale === "ar" ? "جاهز للبدء؟" : "Ready to Get Started?"}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {locale === "ar"
              ? "انضم إلى منصة BrandSpace واكتشف كيف يمكن أن تحول إدارة مساحاتك التجارية"
              : "Join BrandSpace platform and discover how it can transform your commercial space management"}
          </p>
          <Link href="/admin">
            <Button size="lg" className="bg-[#e53e3e] hover:bg-red-600 text-white px-8">
              {locale === "ar" ? "ابدأ مجاناً" : "Start Free Trial"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
                  <Image
                    src="/brandspace-logo.jpeg"
                    alt="BrandSpace"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">BrandSpace</h3>
                  <p className="text-sm text-slate-400">Real Estate Platform</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                {locale === "ar"
                  ? "منصة متطورة لإدارة المساحات التجارية والمولات مع أدوات شاملة للمطورين والمستثمرين"
                  : "Advanced platform for managing commercial spaces and malls with comprehensive tools for developers and investors"}
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                  <Shield className="h-3 w-3 mr-1" />
                  {locale === "ar" ? "آمن ومحمي" : "Secure & Protected"}
                </Badge>
                <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {locale === "ar" ? "موثوق" : "Trusted"}
                </Badge>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">{locale === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    {locale === "ar" ? "المميزات" : "Features"}
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    {locale === "ar" ? "حولنا" : "About"}
                  </a>
                </li>
                <li>
                  <a href="/admin" className="hover:text-white transition-colors">
                    {locale === "ar" ? "لوحة التحكم" : "Admin Panel"}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    {locale === "ar" ? "اتصل بنا" : "Contact"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">{locale === "ar" ? "تواصل معنا" : "Contact Us"}</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@brandspace.com
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +966 11 234 5678
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {locale === "ar" ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 BrandSpace. {locale === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
