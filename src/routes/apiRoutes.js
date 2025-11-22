import express from 'express';

/**
 * Configures API routes.
 * @param {import('../controllers/UserController').UserController} userController 
 * @returns {express.Router}
 */
export const createApiRoutes = (userController) => {
    const router = express.Router();

    router.post('/save-email', userController.saveEmail);
    router.post('/join-waitlist', userController.joinWaitlist);
    router.get('/waitlist-count', userController.getWaitlistCount);

    router.post('/save-personal-info', userController.savePersonalInfo);
    router.post('/save-health-concerns', userController.saveHealthConcerns);
    router.post('/save-service-preferences', userController.saveServicePreferences);
    router.post('/save-assessment', userController.saveAssessment);

    return router;
};
