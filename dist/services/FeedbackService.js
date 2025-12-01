export class FeedbackService {
    feedbackRepo;
    constructor(feedbackRepository) {
        this.feedbackRepo = feedbackRepository;
    }
    async submitFeedback(feedbackText, userId = null, email = null) {
        if (!feedbackText || feedbackText.trim().length === 0) {
            throw new Error('Feedback text cannot be empty');
        }
        await this.feedbackRepo.saveFeedback(feedbackText, userId, email);
    }
}
