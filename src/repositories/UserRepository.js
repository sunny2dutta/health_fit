import { AppError } from '../utils/AppError.js';

/**
 * Repository for User-related database operations.
 * Handles direct interactions with the 'users' table.
 */
export class UserRepository {
    /**
     * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient 
     */
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    /**
     * Creates a new user with the given email.
     * @param {string} email 
     * @returns {Promise<Object>} The created user object.
     */
    async createUser(email) {
        const { data, error } = await this.supabase
            .from("users")
            .insert([{ email_id: email }])
            .select("id, email_id")
            .single();

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
        return data;
    }

    /**
     * Finds a user by their email address.
     * @param {string} email 
     * @returns {Promise<Object|null>} The user object or null if not found.
     */
    async findByEmail(email) {
        const { data, error } = await this.supabase
            .from("users")
            .select("id, is_waitlisted")
            .eq("email_id", email)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            throw new AppError(`DB Error: ${error.message}`, 500);
        }
        return data;
    }

    /**
     * Updates a user's waitlist status.
     * @param {number} userId 
     * @param {boolean} status 
     * @returns {Promise<void>}
     */
    async updateWaitlistStatus(userId, status) {
        const { error } = await this.supabase
            .from("users")
            .update({ is_waitlisted: status })
            .eq("id", userId);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    /**
     * Creates a new user directly into the waitlist.
     * @param {string} email 
     * @returns {Promise<void>}
     */
    async createWaitlistUser(email) {
        const { error } = await this.supabase
            .from("users")
            .insert([{ email_id: email, is_waitlisted: true }]);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    /**
     * Updates user's personal information.
     * @param {number} userId 
     * @param {Object} info 
     * @returns {Promise<void>}
     */
    async savePersonalInfo(userId, info) {
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

    /**
     * Updates user's health concerns.
     * @param {number} userId 
     * @param {string[]} concerns 
     * @returns {Promise<void>}
     */
    async saveHealthConcerns(userId, concerns) {
        const { error } = await this.supabase
            .from("health_concerns")
            .insert([{
                user_id: userId,
                concerns: concerns // Stored as JSON/Text array
            }]);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    /**
     * Updates user's service preferences.
     * @param {number} userId 
     * @param {string[]} preferences 
     * @returns {Promise<void>}
     */
    async saveServicePreferences(userId, preferences) {
        // Assuming a similar structure to health_concerns
        const { error } = await this.supabase
            .from("service_preferences")
            .insert([{
                user_id: userId,
                preferences: preferences
            }]);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }

    /**
     * Saves the final assessment results.
     * @param {number} userId 
     * @param {number} score 
     * @param {Object[]} answers 
     * @returns {Promise<void>}
     */
    async saveAssessment(userId, score, answers) {
        // We need email_id for this table based on schema
        // Fetch email first (or pass it down from controller if available)
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
                assessment_questions: answers // Stored as JSON
            }]);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
    }
    async getWaitlistCount() {
        const { count, error } = await this.supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("is_waitlisted", true);

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
        return count;
    }

    // Add other methods (savePersonalInfo, saveHealthConcerns, etc.) as needed...
    // For brevity in this refactor, I'm focusing on the core flows demonstrated.
}
