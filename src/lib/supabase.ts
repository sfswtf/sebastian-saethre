import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabase() {
  if (typeof window === 'undefined') {
    return null
  }
  
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not configured')
      return null
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return supabaseInstance
}


export type ContactMessage = {
  id?: number
  name: string
  email: string
  message: string
  created_at?: string
}
