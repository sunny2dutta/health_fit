import { Request, Response } from 'express';

export class ConfigController {
    getConfig = (_req: Request, res: Response) => {
        res.json({
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_ANON_KEY
        });
    };
}
