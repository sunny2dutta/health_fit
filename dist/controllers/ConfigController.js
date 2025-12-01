export class ConfigController {
    getConfig = (_req, res) => {
        res.json({
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_ANON_KEY
        });
    };
}
