import { emailSchema, personalInfoSchema, healthConcernsSchema, servicePreferencesSchema, assessmentSchema } from '../validators/userValidators.js';
export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    saveEmail = async (req, res, next) => {
        try {
            const validatedData = emailSchema.parse(req.body);
            const { email } = validatedData;
            const user = await this.userService.registerEmail(email);
            res.status(201).json({
                success: true,
                message: "Email saved",
                user_id: user.id,
                email: user.email_id
            });
        }
        catch (error) {
            next(error);
        }
    };
    joinWaitlist = async (req, res, next) => {
        try {
            const validatedData = emailSchema.parse(req.body);
            const { email } = validatedData;
            const result = await this.userService.joinWaitlist(email);
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
    savePersonalInfo = async (req, res, next) => {
        try {
            const validatedData = personalInfoSchema.parse(req.body);
            const { user_id, full_name, date_of_birth, phone } = validatedData;
            await this.userService.savePersonalInfo(user_id, { full_name, date_of_birth, phone });
            res.status(200).json({ success: true, message: "Personal info saved" });
        }
        catch (error) {
            next(error);
        }
    };
    saveHealthConcerns = async (req, res, next) => {
        try {
            const validatedData = healthConcernsSchema.parse(req.body);
            const { user_id, concerns } = validatedData;
            await this.userService.saveHealthConcerns(user_id, concerns);
            res.status(200).json({ success: true, message: "Health concerns saved" });
        }
        catch (error) {
            next(error);
        }
    };
    saveServicePreferences = async (req, res, next) => {
        try {
            const validatedData = servicePreferencesSchema.parse(req.body);
            const { user_id, preferences } = validatedData;
            await this.userService.saveServicePreferences(user_id, preferences);
            res.status(200).json({ success: true, message: "Service preferences saved" });
        }
        catch (error) {
            next(error);
        }
    };
    saveAssessment = async (req, res, next) => {
        try {
            const validatedData = assessmentSchema.parse(req.body);
            const { user_id, score, answers } = validatedData;
            await this.userService.saveAssessment(user_id, score, answers);
            res.status(200).json({ success: true, message: "Assessment saved" });
        }
        catch (error) {
            next(error);
        }
    };
}
