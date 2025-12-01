import { Request, Response, NextFunction } from 'express';
import { FeedbackService } from '../services/FeedbackService.js';
import { z } from 'zod';

const feedbackSchema = z.object({
    feedback: z.string().min(1, "Feedback cannot be empty"),
    userId: z.number().nullable().optional(),
    email: z.string().email().nullable().optional()
});

export class FeedbackController {
    private feedbackService: FeedbackService;

    constructor(feedbackService: FeedbackService) {
        this.feedbackService = feedbackService;
    }

    submitFeedback = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { feedback, userId } = feedbackSchema.parse(req.body);
            const user = req.user; // Authenticated user

            // Use assessment userId (number) and authenticated email
            await this.feedbackService.submitFeedback(feedback, userId || null, user?.email);

            res.status(200).json({
                success: true,
                message: "Feedback submitted successfully"
            });
        } catch (error) {
            next(error);
        }
    };
}
