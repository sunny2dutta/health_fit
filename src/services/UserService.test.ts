import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './UserService';
import { UserRepository } from '../repositories/UserRepository';

// Mock UserRepository
const mockUserRepo = {
    upsertWaitlistUser: vi.fn(),
    getWaitlistCount: vi.fn(),
} as unknown as UserRepository;

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService(mockUserRepo);
        vi.clearAllMocks();
    });

    describe('joinWaitlist', () => {
        it('should upsert the waitlist user with email only', async () => {
            vi.mocked(mockUserRepo.upsertWaitlistUser).mockResolvedValue({
                id: 1,
                email_id: 'test@example.com',
                is_waitlisted: true
            });

            const result = await userService.joinWaitlist('test@example.com');

            expect(mockUserRepo.upsertWaitlistUser).toHaveBeenCalledWith('test@example.com', undefined);
            expect(result).toEqual({
                success: true,
                message: 'Successfully added to the private waitlist.'
            });
        });

        it('should upsert the waitlist user with phone number', async () => {
            vi.mocked(mockUserRepo.upsertWaitlistUser).mockResolvedValue({
                id: 2,
                email_id: 'new@example.com',
                phone: '+15555550123',
                is_waitlisted: true
            });

            const result = await userService.joinWaitlist('new@example.com', '+15555550123');

            expect(mockUserRepo.upsertWaitlistUser).toHaveBeenCalledWith('new@example.com', '+15555550123');
            expect(result).toEqual({
                success: true,
                message: 'Successfully added to the private waitlist.'
            });
        });
    });

    describe('getWaitlistCount', () => {
        it('should add base count to real count', async () => {
            vi.mocked(mockUserRepo.getWaitlistCount).mockResolvedValue(10);

            const count = await userService.getWaitlistCount();

            expect(count).toBe(101 + 10);
        });
    });
});
