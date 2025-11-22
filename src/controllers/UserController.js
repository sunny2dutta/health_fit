import { AppError } from '../utils/AppError.js';

/**
 * Controller for User-related endpoints.
 * Handles HTTP request parsing and response formatting.
 */
export class UserController {
    /**
     * @param {import('../services/UserService').UserService} userService 
     */
    constructor(userService) {
        this.userService = userService;
    }

    /**
     * Handler for saving email.
     */
    saveEmail = async (req, res, next) => {
        try {
            const { email } = req.body;
            if (!email) throw new AppError("Email is required", 400);

            const user = await this.userService.registerEmail(email);

            res.status(201).json({
                success: true,
                message: "Email saved",
                user_id: user.id,
                email: user.email_id
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handler for joining waitlist.
     */
    joinWaitlist = async (req, res, next) => {
        try {
            const { email } = req.body;
            if (!email) throw new AppError("Email is required", 400);

            const result = await this.userService.joinWaitlist(email);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handler for getting waitlist count.
     */
    getWaitlistCount = async (req, res, next) => {
        try {
            const count = await this.userService.getWaitlistCount();
            res.status(200).json({ count });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handler for saving personal info.
     */
    savePersonalInfo = async (req, res, next) => {
        try {
            const { user_id, full_name, date_of_birth, phone } = req.body;
            if (!user_id) throw new AppError("User ID is required", 400);

            await this.userService.savePersonalInfo(user_id, { full_name, date_of_birth, phone });
            res.status(200).json({ success: true, message: "Personal info saved" });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handler for saving health concerns.
     */
    saveHealthConcerns = async (req, res, next) => {
        try {
            const { user_id, concerns } = req.body;
            if (!user_id) throw new AppError("User ID is required", 400);

            await this.userService.saveHealthConcerns(user_id, concerns);
            res.status(200).json({ success: true, message: "Health concerns saved" });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handler for saving service preferences.
     */
    saveServicePreferences = async (req, res, next) => {
        try {
            const { user_id, preferences } = req.body;
            if (!user_id) throw new AppError("User ID is required", 400);

            await this.userService.saveServicePreferences(user_id, preferences);
            res.status(200).json({ success: true, message: "Service preferences saved" });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Handler for saving assessment.
     */
    saveAssessment = async (req, res, next) => {
        try {
            const { user_id, score, answers } = req.body;
            if (!user_id) throw new AppError("User ID is required", 400);

            await this.userService.saveAssessment(user_id, score, answers);
            res.status(200).json({ success: true, message: "Assessment saved" });
        } catch (error) {
            next(error);
        }
    };
}
