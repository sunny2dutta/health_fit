import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createApiRoutes } from './routes/apiRoutes.js';
import { AppError } from './utils/AppError.js';

export const createApp = ({ userController }) => {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.static('.')); // Serve static files from root

    // 🔥 Serve sitemap.xml explicitly
    app.get('/sitemap.xml', (req, res) => {
        res.sendFile('sitemap.xml', { root: '.' });
    });

    // 🔥 Serve robots.txt explicitly (good for SEO)
    app.get('/robots.txt', (req, res) => {
        res.sendFile('robots.txt', { root: '.' });
    });

    // Routes
    app.use('/api', createApiRoutes(userController));

    // Global Error Handler
    app.use((err, req, res, next) => {
        console.error("Unhandled Error:", err);

        if (err instanceof AppError) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    });

    return app;
};

