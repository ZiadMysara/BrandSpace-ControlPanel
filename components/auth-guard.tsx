"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && !pathname.startsWith("/auth")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router, pathname])

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="falcon-card w-full max-w-md">
          <CardContent className="falcon-card-content p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 animate-pulse">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">BrandSpace</h2>
            <p className="text-slate-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If user is not authenticated and not on auth pages, redirect will happen in useEffect
  if (!user && !pathname.startsWith("/auth")) {
    return null
  }

  return <>{children}</>
}
