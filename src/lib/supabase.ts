import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yclbtxnqqlbmejkoyhwy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbGJ0eG5xcWxibWVqa295aHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTMyMTEsImV4cCI6MjA2Njc2OTIxMX0.6XDv32_KadvdU_4WG_SJM3JkbOAgeTnSLJhAK_bOB5A'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types pour la base de données
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  lead_id: string
  subscription_id: string
  product_name: string
  formula_name: string
  monthly_price: number
  status: 'draft' | 'pending' | 'active' | 'cancelled'
  date_effect: string
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  subscription_id: string
  contract_id: string
  gamme_id: string
  formula_id: string
  status: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  subscription_id: string
  type: string
  filename: string
  content: string
  uploaded_at: string
}