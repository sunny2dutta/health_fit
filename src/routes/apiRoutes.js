import express from 'express';

/**
 * Configures API routes.
 * @param {import('../controllers/UserController').UserController} userController
 * @param {import('../controllers/ChatController').ChatController} chatController
 * @returns {express.Router}
 */
export const createApiRoutes = (userController, chatController) => {
    const router = express.Router();

    router.post('/save-email', userController.saveEmail);
    router.post('/join-waitlist', userController.joinWaitlist);
    router.get('/waitlist-count', userController.getWaitlistCount);

    router.post('/save-personal-info', userController.savePersonalInfo);
    router.post('/save-health-concerns', userController.saveHealthConcerns);
    router.post('/save-service-preferences', userController.saveServicePreferences);
    router.post('/save-assessment', userController.saveAssessment);

    router.post('/chat', chatController.chat);

    return router;
};
