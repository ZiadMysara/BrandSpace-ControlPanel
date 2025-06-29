'use client'

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
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

// JWT utility functions
const JWT_SECRET = "brandspace-secret-key-2024"

// Helper functions for base64 encoding/decoding that work in both browser and Node.js
function base64Encode(str: string): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    return btoa(str)
  } else {
    // Node.js environment
    return Buffer.from(str).toString('base64')
  }
}

function base64Decode(str: string): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    return atob(str)
  } else {
    // Node.js environment
    return Buffer.from(str, 'base64').toString('utf8')
  }
}

function createJWT(payload: any): string {
  const header = { alg: "HS256", typ: "JWT" }
  const encodedHeader = base64Encode(JSON.stringify(header))
  const encodedPayload = base64Encode(JSON.stringify(payload))
  const signature = base64Encode(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`)
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

function verifyJWT(token: string): any {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(base64Decode(parts[1]))

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

// Mock authentication functions
async function mockLogin(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Test credentials
  if (email === "test@example.com" && password === "password123") {
    const user: User = {
      id: 1,
      name: "Test Admin",
      email: "test@example.com",
      phone: "+966501234567",
      userType: 1, // Super Admin
      userPosition: 1, // CEO
      isVerified: true,
      isActive: true,
    }
    return { success: true, user }
  }

  // Check if user exists in localStorage (for demo purposes)
  if (typeof window !== 'undefined') {
    const users = JSON.parse(localStorage.getItem("brandspace_users") || "[]")
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (user.password !== password) {
      return { success: false, error: "Invalid password" }
    }

    return { success: true, user: { ...user, password: undefined } }
  }

  return { success: false, error: "User not found" }
}

async function mockSignup(userData: SignupData): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Only proceed if we're in the browser
  if (typeof window === 'undefined') {
    return { success: false, error: "Signup not available during server-side rendering" }
  }

  // Check if user already exists
  const users = JSON.parse(localStorage.getItem("brandspace_users") || "[]")
  const existingUser = users.find((u: any) => u.email === userData.email)

  if (existingUser) {
    return { success: false, error: "User already exists with this email" }
  }

  // Create new user
  const newUser: User = {
    id: Date.now(), // Simple ID generation
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    userType: userData.userType,
    userPosition: userData.userPosition || undefined,
    isVerified: false,
    isActive: true,
  }

  // Save to localStorage (for demo purposes)
  const userWithPassword = { ...newUser, password: userData.password }
  users.push(userWithPassword)
  localStorage.setItem("brandspace_users", JSON.stringify(users))

  return { success: true, user: newUser }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing token on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("brandspace_token")
      if (token) {
        const payload = verifyJWT(token)
        if (payload && payload.user) {
          setUser(payload.user)
        } else {
          localStorage.removeItem("brandspace_token")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await mockLogin(email, password)

      if (result.success && result.user) {
        const token = createJWT({
          user: result.user,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        })

        if (typeof window !== 'undefined') {
          localStorage.setItem("brandspace_token", token)
        }
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

      if (result.success && result.user) {
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: "Signup failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("brandspace_token")
    }
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