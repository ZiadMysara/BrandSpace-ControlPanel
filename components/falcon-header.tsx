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
    <header className="falcon-header flex items-center justify-between">
      <div>
        <h1 className="falcon-page-title">{title}</h1>
        {subtitle && <p className="falcon-page-subtitle">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        {/* Search - Falcon style */}
        <div className="hidden md:block">
          <div className="falcon-search">
            <Search className="falcon-search-icon" />
            <Input
              placeholder={locale === "ar" ? "البحث..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="falcon-search-input w-80 text-slate-900 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-100">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 falcon-dropdown">
            <DropdownMenuLabel className="font-semibold">
              {locale === "ar" ? "الإشعارات" : "Notifications"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
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
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
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
          <DropdownMenuContent align="end" className="falcon-dropdown">
            <DropdownMenuItem className="falcon-dropdown-item">
              <Mail className="mr-2 h-4 w-4" />
              {locale === "ar" ? "الرسائل" : "Messages"}
            </DropdownMenuItem>
            <DropdownMenuItem className="falcon-dropdown-item">
              <Calendar className="mr-2 h-4 w-4" />
              {locale === "ar" ? "التقويم" : "Calendar"}
            </DropdownMenuItem>
            <DropdownMenuItem className="falcon-dropdown-item">
              <HelpCircle className="mr-2 h-4 w-4" />
              {locale === "ar" ? "المساعدة" : "Help"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu - Exact Falcon style */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-3 hover:bg-slate-100">
              <Avatar className="h-8 w-8 falcon-avatar">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">admin@brandspace.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 falcon-dropdown">
            <DropdownMenuLabel>{locale === "ar" ? "حسابي" : "My Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="falcon-dropdown-item">
              <User className="mr-2 h-4 w-4" />
              {locale === "ar" ? "الملف الشخصي" : "Profile"}
            </DropdownMenuItem>
            <DropdownMenuItem className="falcon-dropdown-item">
              <Settings className="mr-2 h-4 w-4" />
              {locale === "ar" ? "الإعدادات" : "Settings"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="falcon-dropdown-item text-red-600">
              {locale === "ar" ? "تسجيل الخروج" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
