export class UserService {
    userRepo;
    constructor(userRepository) {
        this.userRepo = userRepository;
    }
    async registerEmail(email) {
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
            const hasAssessment = await this.userRepo.hasCompletedAssessment(existingUser.id);
            return {
                ...existingUser,
                isExisting: true,
                has_completed_assessment: hasAssessment
            };
        }
        const newUser = await this.userRepo.createUser(email);
        return {
            ...newUser,
            has_completed_assessment: false
        };
    }
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
    async savePersonalInfo(userId, info) {
        await this.userRepo.savePersonalInfo(userId, info);
    }
    async saveHealthConcerns(userId, concerns) {
        await this.userRepo.saveHealthConcerns(userId, concerns);
    }
    async saveServicePreferences(userId, preferences) {
        await this.userRepo.saveServicePreferences(userId, preferences);
    }
    async saveAssessment(userId, score, answers) {
        await this.userRepo.saveAssessment(userId, score, answers);
    }
    async getWaitlistCount() {
        const realCount = await this.userRepo.getWaitlistCount();
        const BASE_COUNT = 1243; // Marketing baseline
        return BASE_COUNT + (realCount || 0);
    }
}
