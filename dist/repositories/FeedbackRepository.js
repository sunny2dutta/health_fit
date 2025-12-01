import { AppError } from '../utils/AppError.js';
export class FeedbackRepository {
    supabase;
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }
    async saveFeedback(feedbackText, userId = null, email = null) {
        const { error } = await this.supabase
            .from("feedback")
            .insert([{
                user_id: userId,
                email_id: email,
                feedback_text: feedbackText
            }]);
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
    }
}
