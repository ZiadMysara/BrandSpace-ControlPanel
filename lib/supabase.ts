import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing. " +
      "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  )
}

/**
 * A singleton Supabase client for client-side usage.
 * Next.js will tree-shake this on the server automatically.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Ping the database with a trivial query to ensure connectivity.
 * Returns `{ success: boolean; error?: string }`
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // `user_types` is part of the BrandSpace schema seed, so it will exist.
    const { error } = await supabase.from("user_types").select("id").limit(1)

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
