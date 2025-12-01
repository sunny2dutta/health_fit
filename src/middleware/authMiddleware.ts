import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const createAuthMiddleware = (supabase: SupabaseClient) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('Unauthorized: No token provided', 401));
        }

        const token = authHeader.split(' ')[1];

        try {
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                return next(new AppError('Unauthorized: Invalid token', 401));
            }

            req.user = user;
            next();
        } catch (error) {
            next(new AppError('Unauthorized: Authentication failed', 401));
        }
    };
};
