import express, { Router } from 'express';
import { UserController } from '../controllers/UserController.js';


export const createApiRoutes = (
    userController: UserController
): Router => {
    const router = express.Router();

    router.post('/join-waitlist', userController.joinWaitlist);
    router.get('/waitlist-count', userController.getWaitlistCount);

    return router;
};
