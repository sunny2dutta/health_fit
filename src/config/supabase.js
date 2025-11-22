import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://akkzhpkpegrjdlrxoutx.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseKey) {
    console.error("CRITICAL: SUPABASE_SECRET_KEY is missing from .env");
    process.exit(1);
}

/**
 * Supabase client instance.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
