import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  throw new Error("Missing Supabase environment variables")
}

console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Key exists:", !!supabaseAnonKey)

// Default Supabase export for client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("user_types").select("count").limit(1)
    console.log("Supabase connection test:", { data, error })
    return { success: !error, error }
  } catch (error) {
    console.error("Supabase connection failed:", error)
    return { success: false, error }
  }
}