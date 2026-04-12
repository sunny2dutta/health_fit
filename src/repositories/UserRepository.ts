import { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';
import type { WaitlistSubmission } from '../services/UserService.js';

export interface User {
    id: number;
    email_id: string;
    is_waitlisted?: boolean;
    phone?: string | null;
    full_name?: string | null;
    city?: string | null;
    track?: string | null;
    gender?: string | null;
}

export class UserRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async upsertWaitlistUser(submission: WaitlistSubmission): Promise<User> {
        const insertData: {
            email_id: string;
            is_waitlisted: boolean;
            phone?: string;
            full_name?: string;
            city?: string;
            track?: string;
            gender?: string;
        } = {
            email_id: submission.email,
            is_waitlisted: true
        };

        if (submission.phone) insertData.phone = submission.phone;
        if (submission.fullName) insertData.full_name = submission.fullName;
        if (submission.city) insertData.city = submission.city;
        if (submission.track) insertData.track = submission.track;
        if (submission.gender) insertData.gender = submission.gender;

        const { data, error } = await this.supabase
            .from("users")
            .upsert([insertData], { onConflict: "email_id" })
            .select("id, email_id, is_waitlisted, phone, full_name, city, track, gender")
            .single();

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
        return data as User;
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
