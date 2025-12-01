export class ConfigController {
    getConfig = (_req, res) => {
        const supabaseUrl = process.env.SUPABASE_URL || 'https://akkzhpkpegrjdlrxoutx.supabase.co';
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        if (!supabaseKey) {
            console.error('CRITICAL: SUPABASE_ANON_KEY is missing in environment variables!');
        }
        res.json({
            supabaseUrl,
            supabaseKey
        });
    };
}
