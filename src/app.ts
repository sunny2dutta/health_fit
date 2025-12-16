import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { createApiRoutes } from './routes/apiRoutes.js';
import { AppError } from './utils/AppError.js';
import { UserController } from './controllers/UserController.js';
import { ChatController } from './controllers/ChatController.js';
import { FeedbackController } from './controllers/FeedbackController.js';

interface AppDependencies {
    userController: UserController;
    chatController: ChatController;
    feedbackController: FeedbackController;
}

export const createApp = ({ userController, chatController, feedbackController }: AppDependencies): Express => {
    const app = express();

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
    app.use('/api', createApiRoutes(userController, chatController, feedbackController));

    // Serve static files from the React app
    const clientBuildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(clientBuildPath));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (_req, res) => {
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
