import { AppError } from '../utils/AppError.js';
export class UserRepository {
    supabase;
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }
    async upsertWaitlistUser(email, phone) {
        const insertData = {
            email_id: email,
            is_waitlisted: true
        };
        if (phone) {
            insertData.phone = phone;
        }
        const { data, error } = await this.supabase
            .from("users")
            .upsert([insertData], { onConflict: "email_id" })
            .select("id, email_id, is_waitlisted, phone")
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
