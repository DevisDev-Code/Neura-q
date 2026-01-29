// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Prefer environment variables (Vite) with fallback to hard-coded values for local dev
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://citbgiiuqyiwkxyikawa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl) {
	console.warn('Supabase URL is not set. Please configure VITE_SUPABASE_URL in your environment.')
}
if (!supabaseAnonKey) {
	console.warn('Supabase anon key is not set. Please configure VITE_SUPABASE_ANON_KEY in your environment.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)