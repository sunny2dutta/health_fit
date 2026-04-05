export class UserService {
    userRepo;
    constructor(userRepository) {
        this.userRepo = userRepository;
    }
    async joinWaitlist(email, phone) {
        await this.userRepo.upsertWaitlistUser(email, phone);
        return {
            success: true,
            message: 'Successfully added to the private waitlist.'
        };
    }
    async getWaitlistCount() {
        const realCount = await this.userRepo.getWaitlistCount();
        const BASE_COUNT = 101; // Marketing baseline
        return BASE_COUNT + (realCount || 0);
    }
}
