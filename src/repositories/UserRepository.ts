import { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';
import { AssessmentInput } from '../validators/userValidators.js';

export interface User {
    id: number;
    email_id: string;
    is_waitlisted?: boolean;
}

export interface PersonalInfo {
    full_name: string;
    date_of_birth: string;
    phone: string;
}

export class UserRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }



    async createUser(email: string): Promise<User> {
        const { data, error } = await this.supabase
            .from("users")
            .insert([{ email_id: email }])
            .select("id, email_id")
            .single();

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
        return data as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        const { data, error } = await this.supabase
            .from("users")
            .select("id, email_id, is_waitlisted")
            .eq("email_id", email)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw new AppError(`DB Error: ${error.message}`, 500);
        }
        return data as User;
    }

    async updateWaitlistStatus(userId: number, status: boolean): Promise<void> {
        const { error } = await this.supabase
            .from("users")
            .update({ is_waitlisted: status })
            .eq("id", userId);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    async createWaitlistUser(email: string): Promise<void> {
        const { error } = await this.supabase
            .from("users")
            .insert([{ email_id: email, is_waitlisted: true }]);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    async savePersonalInfo(userId: number, info: PersonalInfo): Promise<void> {
        const { error } = await this.supabase
            .from("personal_info")
            .insert([{
                user_id: userId,
                full_name: info.full_name,
                date_of_birth: info.date_of_birth,
                phone: info.phone
            }]);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    async saveHealthConcerns(userId: number, concerns: string[]): Promise<void> {
        const { error } = await this.supabase
            .from("health_concerns")
            .insert([{
                user_id: userId,
                concerns: concerns
            }]);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    async saveServicePreferences(userId: number, preferences: string[]): Promise<void> {
        const { error } = await this.supabase
            .from("service_preferences")
            .insert([{
                user_id: userId,
                preferences: preferences
            }]);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    async saveAssessment(userId: number, score: number, answers: AssessmentInput['answers']): Promise<void> {
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

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    async getWaitlistCount(): Promise<number> {
        const { count, error } = await this.supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("is_waitlisted", true);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
        return count || 0;
    }
}
