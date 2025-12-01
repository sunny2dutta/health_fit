import { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';

export interface Feedback {
    id?: number;
    user_id?: number | null;
    feedback_text: string;
    created_at?: string;
}

export class FeedbackRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async saveFeedback(feedbackText: string, userId: number | null = null, email: string | null = null): Promise<void> {
        const { error } = await this.supabase
            .from("feedback")
            .insert([{
                user_id: userId,
                email_id: email,
                feedback_text: feedbackText
            }]);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }
}
