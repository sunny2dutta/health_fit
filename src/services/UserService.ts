import { UserRepository, User, PersonalInfo } from '../repositories/UserRepository.js';
import { AssessmentInput } from '../validators/userValidators.js';

export class UserService {
    private userRepo: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepo = userRepository;
    }

    async registerEmail(email: string): Promise<User & { isExisting?: boolean, has_completed_assessment?: boolean }> {
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

    async joinWaitlist(email: string): Promise<{ success: boolean; alreadyJoined?: boolean; updated?: boolean; created?: boolean }> {
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

    async savePersonalInfo(userId: number, info: PersonalInfo): Promise<void> {
        await this.userRepo.savePersonalInfo(userId, info);
    }

    async saveHealthConcerns(userId: number, concerns: string[]): Promise<void> {
        await this.userRepo.saveHealthConcerns(userId, concerns);
    }

    async saveServicePreferences(userId: number, preferences: string[]): Promise<void> {
        await this.userRepo.saveServicePreferences(userId, preferences);
    }

    async saveAssessment(userId: number, score: number, answers: AssessmentInput['answers']): Promise<void> {
        await this.userRepo.saveAssessment(userId, score, answers);
    }

    async getWaitlistCount(): Promise<number> {
        const realCount = await this.userRepo.getWaitlistCount();
        const BASE_COUNT = 1243; // Marketing baseline
        return BASE_COUNT + (realCount || 0);
    }
}
