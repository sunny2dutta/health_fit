import express, { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { TestimonialController } from '../controllers/TestimonialController.js';


export const createApiRoutes = (
    userController: UserController,
    testimonialController: TestimonialController
): Router => {
    const router = express.Router();

    router.post('/join-waitlist', userController.joinWaitlist);
    router.get('/waitlist-count', userController.getWaitlistCount);
    router.get('/testimonials', testimonialController.getPublishedTestimonials);

    return router;
};
