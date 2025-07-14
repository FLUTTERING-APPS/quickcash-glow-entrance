import { createClient } from '@supabase/supabase-js'

// For Lovable's native Supabase integration, these should be automatically available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Add error checking
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  console.error('Supabase URL not found. Please ensure Supabase integration is properly configured.')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.error('Supabase Anon Key not found. Please ensure Supabase integration is properly configured.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)