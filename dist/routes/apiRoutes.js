import express from 'express';
export const createApiRoutes = (userController) => {
    const router = express.Router();
    router.post('/join-waitlist', userController.joinWaitlist);
    router.get('/waitlist-count', userController.getWaitlistCount);
    return router;
};
