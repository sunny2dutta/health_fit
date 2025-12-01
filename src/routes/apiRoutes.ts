import express, { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { ChatController } from '../controllers/ChatController.js';
import { FeedbackController } from '../controllers/FeedbackController.js';
import { AuthController } from '../controllers/AuthController.js';
import { ConfigController } from '../controllers/ConfigController.js';

export const createApiRoutes = (
    userController: UserController,
    chatController: ChatController,
    feedbackController: FeedbackController,
    authController: AuthController,
    configController: ConfigController,
    requireAuth: express.RequestHandler
): Router => {
    const router = express.Router();

    // Config Route
    router.get('/config', configController.getConfig);

    // Auth Routes
    router.post('/auth/signup', authController.signUp);
    router.post('/auth/signin', authController.signIn);

    router.post('/save-email', userController.saveEmail);
    router.post('/join-waitlist', userController.joinWaitlist);
    router.get('/waitlist-count', userController.getWaitlistCount);

    router.post('/save-personal-info', userController.savePersonalInfo);
    router.post('/save-health-concerns', userController.saveHealthConcerns);
    router.post('/save-service-preferences', userController.saveServicePreferences);
    router.post('/save-assessment', userController.saveAssessment);

    // Protected Routes
    router.post('/chat', requireAuth, chatController.chat);
    router.post('/feedback', requireAuth, feedbackController.submitFeedback);

    return router;
};
