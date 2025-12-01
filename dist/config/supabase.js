import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = 'https://akkzhpkpegrjdlrxoutx.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';
if (!supabaseKey && process.env.NODE_ENV !== 'test') {
    console.warn("WARNING: SUPABASE_SECRET_KEY is missing. Database operations will fail.");
}
export const supabase = createClient(supabaseUrl, supabaseKey);
