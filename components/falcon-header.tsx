"use client"

import { useState } from "react"
import { Bell, Search, Settings, User, ChevronDown, Mail, Calendar, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface FalconHeaderProps {
  title: string
  subtitle?: string
  locale: "en" | "ar"
}

export function FalconHeader({ title, subtitle, locale }: FalconHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="flex items-center justify-between p-6 bg-white border-b border-slate-200">
      <div>
        <h1 className="text-2xl font-bold brandspace-text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        {/* Search - Brand Space style */}
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={locale === "ar" ? "البحث..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 border-slate-200 focus:border-[#1a365d] focus:ring-[#1a365d]"
            />
          </div>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-100">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#e53e3e] text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-semibold">
              {locale === "ar" ? "الإشعارات" : "Notifications"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#1a365d] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New inquiry received</p>
                  <p className="text-xs text-slate-500">2 minutes ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Payment completed</p>
                  <p className="text-xs text-slate-500">1 hour ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#e53e3e] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New booking request</p>
                  <p className="text-xs text-slate-500">3 hours ago</p>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
              <Settings className="h-5 w-5 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              {locale === "ar" ? "الرسائل" : "Messages"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              {locale === "ar" ? "التقويم" : "Calendar"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              {locale === "ar" ? "المساعدة" : "Help"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu - Brand Space style */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-3 hover:bg-slate-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-[#1a365d] text-white text-sm font-medium">AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium brandspace-text-primary">Admin User</p>
                <p className="text-xs text-slate-500">admin@brandspace.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{locale === "ar" ? "حسابي" : "My Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              {locale === "ar" ? "الملف الشخصي" : "Profile"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              {locale === "ar" ? "الإعدادات" : "Settings"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#e53e3e]">
              {locale === "ar" ? "تسجيل الخروج" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
