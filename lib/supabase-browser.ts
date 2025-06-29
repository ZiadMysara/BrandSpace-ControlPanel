/**
 * Client-side Supabase helper.
 * ──────────────────────────────────────────────────────────
 * • Does NOT import `next/headers`, so it is always safe in
 *   Client Components or traditional `pages/` code.
 * • Uses the public anon key – adequate for read-only admin
 *   dashboards.  Adjust auth as needed for your app.
 */
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.")
}

/**
 * A singleton Supabase instance for the browser.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})
