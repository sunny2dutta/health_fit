import { waitlistSchema } from '../validators/userValidators.js';
export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    joinWaitlist = async (req, res, next) => {
        try {
            const validatedData = waitlistSchema.parse(req.body);
            const { email, phone } = validatedData;
            const result = await this.userService.joinWaitlist(email, phone);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    getWaitlistCount = async (_req, res, next) => {
        try {
            const count = await this.userService.getWaitlistCount();
            res.status(200).json({ count });
        }
        catch (error) {
            next(error);
        }
    };
}
