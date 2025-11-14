import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akkzhpkpegrjdlrxoutx.supabase.co'
const supabaseKey = process.env.SUPABASE_SECRET_KEY // we’ll set this next

export const supabase = createClient(supabaseUrl, supabaseKey)

