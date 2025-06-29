"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  phone: string
  userType: number
  userPosition?: number
  isVerified: boolean
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

interface SignupData {
  name: string
  email: string
  phone: string
  password: string
  userType: number
  userPosition?: number | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Simple token management without complex JWT
function createToken(user: User): string {
  const tokenData = {
    user,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return JSON.stringify(tokenData)
}

function verifyToken(token: string): User | null {
  try {
    const tokenData = JSON.parse(token)
    if (tokenData.exp && Date.now() >= tokenData.exp) {
      return null
    }
    return tokenData.user
  } catch {
    return null
  }
}

// Mock authentication
async function mockLogin(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "test@example.com" && password === "password123") {
    const user: User = {
      id: 1,
      name: "Test Admin",
      email: "test@example.com",
      phone: "+966501234567",
      userType: 1,
      userPosition: 1,
      isVerified: true,
      isActive: true,
    }
    return { success: true, user }
  }

  return { success: false, error: "Invalid credentials" }
}

async function mockSignup(userData: SignupData): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const newUser: User = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    userType: userData.userType,
    userPosition: userData.userPosition || undefined,
    isVerified: false,
    isActive: true,
  }

  return { success: true, user: newUser }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("brandspace_token")
    if (token) {
      const userData = verifyToken(token)
      if (userData) {
        setUser(userData)
      } else {
        localStorage.removeItem("brandspace_token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await mockLogin(email, password)

      if (result.success && result.user) {
        const token = createToken(result.user)
        localStorage.setItem("brandspace_token", token)
        setUser(result.user)
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "Login failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupData) => {
    setIsLoading(true)
    try {
      const result = await mockSignup(userData)
      return result.success ? { success: true } : { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "Signup failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("brandspace_token")
    setUser(null)
    router.push("/auth/login")
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}