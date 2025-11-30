import { AppError } from '../utils/AppError.js';
export class UserRepository {
    supabase;
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }
    async createUser(email) {
        const { data, error } = await this.supabase
            .from("users")
            .insert([{ email_id: email }])
            .select("id, email_id")
            .single();
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
        return data;
    }
    async findByEmail(email) {
        const { data, error } = await this.supabase
            .from("users")
            .select("id, email_id, is_waitlisted")
            .eq("email_id", email)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null;
            throw new AppError(`DB Error: ${error.message}`, 500);
        }
        return data;
    }
    async updateWaitlistStatus(userId, status) {
        const { error } = await this.supabase
            .from("users")
            .update({ is_waitlisted: status })
            .eq("id", userId);
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
    }
    async createWaitlistUser(email) {
        const { error } = await this.supabase
            .from("users")
            .insert([{ email_id: email, is_waitlisted: true }]);
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
    }
    async savePersonalInfo(userId, info) {
        const { error } = await this.supabase
            .from("personal_info")
            .insert([{
                user_id: userId,
                full_name: info.full_name,
                date_of_birth: info.date_of_birth,
                phone: info.phone
            }]);
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
    }
    async saveHealthConcerns(userId, concerns) {
        const { error } = await this.supabase
            .from("health_concerns")
            .insert([{
                user_id: userId,
                concerns: concerns
            }]);
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
    }
    async saveServicePreferences(userId, preferences) {
        const { error } = await this.supabase
            .from("service_preferences")
            .insert([{
                user_id: userId,
                preferences: preferences
            }]);
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
    }
    async saveAssessment(userId, score, answers) {
        const { data: user } = await this.supabase
            .from("users")
            .select("email_id")
            .eq("id", userId)
            .single();
        const { error } = await this.supabase
            .from("assessments")
            .insert([{
                user_id: userId,
                email_id: user?.email_id,
                score: score,
                assessment_questions: answers
            }]);
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
    }
    async getWaitlistCount() {
        const { count, error } = await this.supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("is_waitlisted", true);
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
        return count || 0;
    }
}
