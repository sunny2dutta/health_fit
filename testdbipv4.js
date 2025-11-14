import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const SUPABASE_URL = 'https://akkzhpkpegrjdlrxoutx.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function insertProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: '124', name: 'Sunny', city: 'Kolkata' }])

  if (error) console.error('❌ Error inserting data:', error)
  else console.log('✅ Inserted successfully:', data)
}

insertProfile()

