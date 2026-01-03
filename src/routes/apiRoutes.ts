import express, { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { ChatController } from '../controllers/ChatController.js';
import { FeedbackController } from '../controllers/FeedbackController.js';
import { AuthController } from '../controllers/AuthController.js';

export const createApiRoutes = (
    userController: UserController,
    chatController: ChatController,
    feedbackController: FeedbackController,
    authController: AuthController
): Router => {
    const router = express.Router();

    router.post('/auth/google', authController.googleSignIn);

    router.post('/save-email', userController.saveEmail);
    router.post('/join-waitlist', userController.joinWaitlist);
    router.get('/waitlist-count', userController.getWaitlistCount);

    router.post('/save-personal-info', userController.savePersonalInfo);
    router.post('/save-health-concerns', userController.saveHealthConcerns);
    router.post('/save-service-preferences', userController.saveServicePreferences);
    router.post('/save-assessment', userController.saveAssessment);

    router.post('/chat', chatController.chat);
    router.post('/feedback', feedbackController.submitFeedback);

    return router;
};
