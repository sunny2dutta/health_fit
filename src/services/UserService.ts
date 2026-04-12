import { UserRepository } from '../repositories/UserRepository.js';

export interface WaitlistSubmission {
    email: string;
    phone?: string;
    fullName?: string;
    city?: string;
    track?: string;
    gender?: string;
}

export class UserService {
    private userRepo: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepo = userRepository;
    }

    async joinWaitlist(submission: WaitlistSubmission): Promise<{ success: boolean; message: string }> {
        await this.userRepo.upsertWaitlistUser(submission);
        return {
            success: true,
            message: 'Successfully added to the private waitlist.'
        };
    }

    async getWaitlistCount(): Promise<number> {
        const realCount = await this.userRepo.getWaitlistCount();
        const BASE_COUNT = 101; // Marketing baseline
        return BASE_COUNT + (realCount || 0);
    }
}
