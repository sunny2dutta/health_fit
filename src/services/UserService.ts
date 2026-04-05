import { UserRepository } from '../repositories/UserRepository.js';

export class UserService {
    private userRepo: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepo = userRepository;
    }

    async joinWaitlist(email: string, phone?: string): Promise<{ success: boolean; message: string }> {
        await this.userRepo.upsertWaitlistUser(email, phone);
        return {
            success: true,
            message: 'Successfully added to the private waitlist.'
        };
    }

    async getWaitlistCount(): Promise<number> {
        const realCount = await this.userRepo.getWaitlistCount();
        const BASE_COUNT = 1243; // Marketing baseline
        return BASE_COUNT + (realCount || 0);
    }
}
