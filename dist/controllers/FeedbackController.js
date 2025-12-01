import { z } from 'zod';
const feedbackSchema = z.object({
    feedback: z.string().min(1, "Feedback cannot be empty"),
    userId: z.number().nullable().optional(),
    email: z.string().email().nullable().optional()
});
export class FeedbackController {
    feedbackService;
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    submitFeedback = async (req, res, next) => {
        try {
            const { feedback } = feedbackSchema.parse(req.body);
            const user = req.user; // Authenticated user
            // Use authenticated user ID and email
            await this.feedbackService.submitFeedback(feedback, user?.id, user?.email);
            res.status(200).json({
                success: true,
                message: "Feedback submitted successfully"
            });
        }
        catch (error) {
            next(error);
        }
    };
}
