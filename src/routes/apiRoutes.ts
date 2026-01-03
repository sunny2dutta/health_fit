import express, { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { ChatController } from '../controllers/ChatController.js';
import { FeedbackController } from '../controllers/FeedbackController.js';


export const createApiRoutes = (
    userController: UserController,
    chatController: ChatController,
    feedbackController: FeedbackController
): Router => {
    const router = express.Router();



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
