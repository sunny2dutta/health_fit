import express from 'express';
export const createApiRoutes = (userController, chatController, feedbackController) => {
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
