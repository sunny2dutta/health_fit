export class UserService {
    userRepo;
    constructor(userRepository) {
        this.userRepo = userRepository;
    }
    async registerEmail(email) {
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
            return {
                ...existingUser,
                isExisting: true
            };
        }
        return await this.userRepo.createUser(email);
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
