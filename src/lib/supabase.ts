import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have valid environment variables
export const supabase = supabaseUrl !== 'https://placeholder.supabase.co'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
