import { z } from 'zod';
import { AppError } from '../utils/AppError.js';
const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
export class AuthController {
    supabase;
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }
    signUp = async (req, res, next) => {
        try {
            const { email, password } = authSchema.parse(req.body);
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password
            });
            if (error)
                throw new AppError(error.message, 400);
            res.status(200).json({
                success: true,
                session: data.session,
                user: data.user
            });
        }
        catch (error) {
            next(error);
        }
    };
    signIn = async (req, res, next) => {
        try {
            const { email, password } = authSchema.parse(req.body);
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error)
                throw new AppError(error.message, 401);
            res.status(200).json({
                success: true,
                session: data.session,
                user: data.user
            });
        }
        catch (error) {
            next(error);
        }
    };
}
