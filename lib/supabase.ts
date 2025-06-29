import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export configuration status
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl)
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY exists:", !!supabaseAnonKey)
}

console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Key exists:", !!supabaseAnonKey)

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'brandspace-admin'
    }
  }
})

// Test connection function
export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...")
    
    // Test with a simple query that should work on any Supabase instance
    const { data, error, count } = await supabase
      .from('user_types')
      .select('*', { count: 'exact' })
      .limit(1)
    
    console.log("Supabase connection test result:", { 
      success: !error, 
      error: error?.message,
      dataExists: !!data,
      count 
    })
    
    if (error) {
      console.error("Supabase error details:", error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data, count }
  } catch (error: any) {
    console.error("Supabase connection failed:", error)
    return { success: false, error: error.message }
  }
}

// Initialize connection test
if (typeof window !== 'undefined') {
  // Only run in browser
  testSupabaseConnection().then(result => {
    if (result.success) {
      console.log("✅ Supabase connection successful")
    } else {
      console.error("❌ Supabase connection failed:", result.error)
    }
  })
}