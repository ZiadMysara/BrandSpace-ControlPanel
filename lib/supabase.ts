import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if environment variables are properly configured
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "https://your-project-ref.supabase.co" &&
  supabaseAnonKey !== "your-anon-key-here"

if (!isSupabaseConfigured) {
  console.warn("⚠️ Supabase is not properly configured. Please update your .env.local file with actual Supabase credentials.")
  console.warn("Current URL:", supabaseUrl)
  console.warn("Key configured:", !!supabaseAnonKey)
}

// Create a mock client when Supabase is not configured
const createMockClient = () => ({
  from: (table: string) => ({
    select: (columns?: string, options?: any) => Promise.resolve({ 
      data: [], 
      error: null, 
      count: 0 
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    eq: (column: string, value: any) => ({
      select: (columns?: string) => Promise.resolve({ data: [], error: null }),
    }),
    gte: (column: string, value: any) => ({
      select: (columns?: string) => Promise.resolve({ data: [], error: null }),
    }),
  }),
  auth: {
    persistSession: false,
  },
})

// Default Supabase export for client components
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : createMockClient() as any

// Test connection function
export async function testSupabaseConnection() {
  if (!isSupabaseConfigured) {
    return { 
      success: false, 
      error: "Supabase not configured. Please update .env.local with actual credentials." 
    }
  }

  try {
    const { data, error } = await supabase.from("user_types").select("count").limit(1)
    console.log("Supabase connection test:", { data, error })
    return { success: !error, error }
  } catch (error) {
    console.error("Supabase connection failed:", error)
    return { success: false, error }
  }
}

export { isSupabaseConfigured }