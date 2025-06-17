export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          event_date: string
          image_url: string | null
          ticket_price: number | null
          capacity: number | null
          location: string | null
          status: 'draft' | 'published' | 'cancelled'
          tickets_url: string | null
          festival: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          event_date: string
          image_url?: string | null
          ticket_price?: number | null
          capacity?: number | null
          location?: string | null
          status?: 'draft' | 'published' | 'cancelled'
          tickets_url?: string | null
          festival?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          event_date?: string
          image_url?: string | null
          ticket_price?: number | null
          capacity?: number | null
          location?: string | null
          status?: 'draft' | 'published' | 'cancelled'
          tickets_url?: string | null
          festival?: string | null
        }
      }
      about_page: {
        Row: {
          id: string
          created_at: string
          content: Json
          published_at: string | null
          version: number
        }
        Insert: {
          id?: string
          created_at?: string
          content: Json
          published_at?: string | null
          version?: number
        }
        Update: {
          id?: string
          created_at?: string
          content?: Json
          published_at?: string | null
          version?: number
        }
      }
      contact_messages: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          message: string
          status: 'unread' | 'read' | 'replied'
          admin_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          message: string
          status?: 'unread' | 'read' | 'replied'
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          message?: string
          status?: 'unread' | 'read' | 'replied'
          admin_notes?: string | null
        }
      }
      // ... existing table definitions ...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 