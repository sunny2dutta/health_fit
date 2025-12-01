import { FeedbackRepository } from '../repositories/FeedbackRepository.js';

export class FeedbackService {
    private feedbackRepo: FeedbackRepository;

    constructor(feedbackRepository: FeedbackRepository) {
        this.feedbackRepo = feedbackRepository;
    }

    async submitFeedback(feedbackText: string, userId: number | null = null, email: string | null = null): Promise<void> {
        if (!feedbackText || feedbackText.trim().length === 0) {
            throw new Error('Feedback text cannot be empty');
        }
        await this.feedbackRepo.saveFeedback(feedbackText, userId, email);
    }
}
