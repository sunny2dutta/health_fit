import express from 'express';
export const createApiRoutes = (userController, testimonialController) => {
    const router = express.Router();
    router.post('/join-waitlist', userController.joinWaitlist);
    router.get('/waitlist-count', userController.getWaitlistCount);
    router.get('/testimonials', testimonialController.getPublishedTestimonials);
    return router;
};
