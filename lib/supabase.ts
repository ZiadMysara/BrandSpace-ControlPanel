import { createClient } from "@supabase/supabase-js"

// Ensure these environment variables are set in your Vercel project settings.
// They must be prefixed with NEXT_PUBLIC_ to be accessible on the client-side.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Export configuration status
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

let supabaseInstance: ReturnType<typeof createClient>

/* ----------  add near the top, after supabase declaration  --------- */
export async function testSupabaseConnection() {
  if (!supabaseInstance) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    // Simple query that exists in every BrandSpace DB
    const { error } = await supabaseInstance.from("user_types").select("id").limit(1)
    return error ? { success: false, error: error.message } : { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
/* -------------------------------------------------------------- */

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables are missing or invalid.")
  console.error(
    "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your Vercel project environment variables.",
  )
  // Throwing an error here will prevent the application from starting if Supabase is critical.
  // This makes the problem explicit during development/deployment.
  throw new Error(
    "Supabase client cannot be initialized: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  )
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "x-my-custom-header": "brandspace-admin",
      },
    },
  })

  // Initialize connection test
  if (typeof window !== "undefined") {
    // Only run in browser
    testSupabaseConnection().then((result) => {
      if (result.success) {
        console.log("✅ Supabase connection successful")
      } else {
        console.error("❌ Supabase connection failed:", result.error)
      }
    })
  }
}

export const supabase = supabaseInstance
