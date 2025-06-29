/**
 * Server-side Supabase helpers.
 * ──────────────────────────────────────────────────────────
 * Safe to import ONLY in Server Components, Route Handlers,
 * or Server Actions – anywhere `next/headers` is available.
 */
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * RLS-aware client that automatically forwards / refreshes cookies.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (all) => all.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  })
}

/**
 * Unrestricted admin client – handy for scripts or cron jobs.
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
