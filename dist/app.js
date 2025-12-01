import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { createApiRoutes } from './routes/apiRoutes.js';
import { AppError } from './utils/AppError.js';
import { createAuthMiddleware } from './middleware/authMiddleware.js';
export const createApp = ({ userController, chatController, feedbackController, authController, configController, supabase }) => {
    const app = express();
    const requireAuth = createAuthMiddleware(supabase);
    // Security Middleware
    app.use(helmet());
    // Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use('/api', limiter);
    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.static('.')); // Serve static files from root
    // 🔥 Serve sitemap.xml explicitly
    app.get('/sitemap.xml', (_req, res) => {
        res.sendFile('sitemap.xml', { root: '.' });
    });
    // 🔥 Serve robots.txt explicitly (good for SEO)
    app.get('/robots.txt', (_req, res) => {
        res.sendFile('robots.txt', { root: '.' });
    });
    // Routes
    app.use('/api', createApiRoutes(userController, chatController, feedbackController, authController, configController, requireAuth));
    // Global Error Handler
    app.use((err, _req, res, _next) => {
        console.error("Error:", err);
        // Handle Zod Validation Errors
        if (err instanceof ZodError) {
            return res.status(400).json({
                status: 'fail',
                message: 'Validation Error',
                errors: err.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        // Handle Operational Errors
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // Handle Unknown Errors
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    });
    return app;
};
