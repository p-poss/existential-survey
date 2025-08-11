import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have valid environment variables
export const supabase = supabaseUrl !== 'https://placeholder.supabase.co' 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types for TypeScript
export interface SurveyResponse {
  id: string
  created_at: string
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
  q6: string
  q7: string
  q8: string
  q9: string
  q10: string
  q11: string
  q12: string
  q13: string
  q1_option?: string // For multiple choice question 1 (write-in)
  completion_time?: number // in seconds
}

export interface SurveyQuestion {
  id: number
  type: 'text' | 'multiple_choice'
  question: string
  options?: string[] // For multiple choice questions
}
