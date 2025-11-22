/**
 * Service for User-related business logic.
 * Orchestrates data flow between Controller and Repository.
 */
export class UserService {
    /**
     * @param {import('../repositories/UserRepository').UserRepository} userRepository 
     */
    constructor(userRepository) {
        this.userRepo = userRepository;
    }

    /**
     * Registers a new email.
     * @param {string} email 
     * @returns {Promise<Object>}
     */
    async registerEmail(email) {
        // Logic: Check if exists? For now, just create (as per original logic)
        // In a real app, we'd check for duplicates here.
        return await this.userRepo.createUser(email);
    }

    /**
     * Adds a user to the waitlist.
     * Handles logic for existing vs new users.
     * @param {string} email 
     * @returns {Promise<Object>} Result status.
     */
    async joinWaitlist(email) {
        const existingUser = await this.userRepo.findByEmail(email);

        if (existingUser) {
            if (existingUser.is_waitlisted) {
                return { success: true, alreadyJoined: true };
            }
            await this.userRepo.updateWaitlistStatus(existingUser.id, true);
            return { success: true, updated: true };
        }

        await this.userRepo.createWaitlistUser(email);
        return { success: true, created: true };
    }

    /**
     * Saves personal information.
     * @param {number} userId 
     * @param {Object} info 
     */
    async savePersonalInfo(userId, info) {
        await this.userRepo.savePersonalInfo(userId, info);
    }

    /**
     * Saves health concerns.
     * @param {number} userId 
     * @param {string[]} concerns 
     */
    async saveHealthConcerns(userId, concerns) {
        await this.userRepo.saveHealthConcerns(userId, concerns);
    }

    /**
     * Saves service preferences.
     * @param {number} userId 
     * @param {string[]} preferences 
     */
    async saveServicePreferences(userId, preferences) {
        await this.userRepo.saveServicePreferences(userId, preferences);
    }

    /**
     * Saves final assessment.
     * @param {number} userId 
     * @param {number} score 
     * @param {Object[]} answers 
     */
    async saveAssessment(userId, score, answers) {
        await this.userRepo.saveAssessment(userId, score, answers);
    }

    /**
     * Retrieves the current waitlist count with a base offset.
     * @returns {Promise<number>}
     */
    async getWaitlistCount() {
        const realCount = await this.userRepo.getWaitlistCount();
        const BASE_COUNT = 1243; // Marketing baseline
        return BASE_COUNT + (realCount || 0);
    }
}
