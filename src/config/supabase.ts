import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://akkzhpkpegrjdlrxoutx.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';

if (!supabaseKey && process.env.NODE_ENV !== 'test') {
    throw new Error('SUPABASE_SECRET_KEY is required to start the application.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
