import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApiRoutes } from './routes/apiRoutes.js';
import { AppError } from './utils/AppError.js';
import { UserController } from './controllers/UserController.js';
import { TestimonialController } from './controllers/TestimonialController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AppDependencies {
    userController: UserController;
    testimonialController: TestimonialController;
}

export const createApp = ({ userController, testimonialController }: AppDependencies): Express => {
    const app = express();
    app.set('trust proxy', 1);
    const allowedOrigins = (process.env.FRONTEND_ORIGINS || '')
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean);

    // Security Middleware
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false
    }));

    // Request Logging Middleware
    app.use((req, _res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });

    // Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use('/api', limiter);

    // Middleware
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error('Not allowed by CORS'));
        }
    }));
    app.use(express.json());

    // 🔥 Serve sitemap.xml explicitly
    app.get('/sitemap.xml', (_req: Request, res: Response) => {
        res.sendFile('sitemap.xml', { root: '.' });
    });

    // 🔥 Serve robots.txt explicitly (good for SEO)
    app.get('/robots.txt', (_req: Request, res: Response) => {
        res.sendFile('robots.txt', { root: '.' });
    });

    // Routes
    app.use('/api', createApiRoutes(userController, testimonialController));

    // Serve the compiled frontend from the same Cloud Run service.
    const clientBuildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(clientBuildPath, {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith('index.html')) {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
        }
    }));

    app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });

    // Global Error Handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error("Error:", err);

        // Handle Zod Validation Errors
        // Handle Zod Validation Errors
        if (err instanceof ZodError || (err as any).name === 'ZodError') {
            return res.status(400).json({
                status: 'fail',
                message: 'Validation Error',
                errors: (err as any).errors ? (err as any).errors.map((e: any) => ({
                    field: e.path.join('.'),
                    message: e.message
                })) : []
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
