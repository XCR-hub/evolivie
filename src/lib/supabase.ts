import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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