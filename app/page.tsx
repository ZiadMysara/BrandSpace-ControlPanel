"use client"

import { redirect } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (!isLoading) {
    if (isAuthenticated) {
      redirect("/admin")
    } else {
      redirect("/auth/login")
    }
  }

  return null
}
