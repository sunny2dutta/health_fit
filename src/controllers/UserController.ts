import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService.js';
import { waitlistSchema } from '../validators/userValidators.js';

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    joinWaitlist = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = waitlistSchema.parse(req.body);
            const { email, phone } = validatedData;

            const result = await this.userService.joinWaitlist(email, phone);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getWaitlistCount = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const count = await this.userService.getWaitlistCount();
            res.status(200).json({ count });
        } catch (error) {
            next(error);
        }
    };
}
