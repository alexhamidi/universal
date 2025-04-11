import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC || process.env.SUPABASE_PUBLIC

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
