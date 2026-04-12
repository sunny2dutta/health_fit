import { AppError } from '../utils/AppError.js';
export class UserRepository {
    supabase;
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }
    async upsertWaitlistUser(submission) {
        const insertData = {
            email_id: submission.email,
            is_waitlisted: true
        };
        if (submission.phone)
            insertData.phone = submission.phone;
        if (submission.fullName)
            insertData.full_name = submission.fullName;
        if (submission.city)
            insertData.city = submission.city;
        if (submission.track)
            insertData.track = submission.track;
        if (submission.gender)
            insertData.gender = submission.gender;
        const { data, error } = await this.supabase
            .from("users")
            .upsert([insertData], { onConflict: "email_id" })
            .select("id, email_id, is_waitlisted, phone, full_name, city, track, gender")
            .single();
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
        return data;
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
