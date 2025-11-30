import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './UserService';
import { UserRepository } from '../repositories/UserRepository';

// Mock UserRepository
const mockUserRepo = {
    findByEmail: vi.fn(),
    createUser: vi.fn(),
    updateWaitlistStatus: vi.fn(),
    createWaitlistUser: vi.fn(),
    savePersonalInfo: vi.fn(),
    saveHealthConcerns: vi.fn(),
    saveServicePreferences: vi.fn(),
    saveAssessment: vi.fn(),
    getWaitlistCount: vi.fn(),
} as unknown as UserRepository;

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService(mockUserRepo);
        vi.clearAllMocks();
    });

    describe('registerEmail', () => {
        it('should return existing user if email exists', async () => {
            const mockUser = { id: 1, email_id: 'test@example.com' };
            vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(mockUser);

            const result = await userService.registerEmail('test@example.com');

            expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(result).toEqual({ ...mockUser, isExisting: true });
            expect(mockUserRepo.createUser).not.toHaveBeenCalled();
        });

        it('should create new user if email does not exist', async () => {
            vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);
            const newUser = { id: 2, email_id: 'new@example.com' };
            vi.mocked(mockUserRepo.createUser).mockResolvedValue(newUser);

            const result = await userService.registerEmail('new@example.com');

            expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('new@example.com');
            expect(mockUserRepo.createUser).toHaveBeenCalledWith('new@example.com');
            expect(result).toEqual(newUser);
        });
    });

    describe('joinWaitlist', () => {
        it('should return alreadyJoined if user is already on waitlist', async () => {
            const mockUser = { id: 1, email_id: 'test@example.com', is_waitlisted: true };
            vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(mockUser);

            const result = await userService.joinWaitlist('test@example.com');

            expect(result).toEqual({ success: true, alreadyJoined: true });
            expect(mockUserRepo.updateWaitlistStatus).not.toHaveBeenCalled();
        });

        it('should update status if user exists but not on waitlist', async () => {
            const mockUser = { id: 1, email_id: 'test@example.com', is_waitlisted: false };
            vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(mockUser);

            const result = await userService.joinWaitlist('test@example.com');

            expect(mockUserRepo.updateWaitlistStatus).toHaveBeenCalledWith(1, true);
            expect(result).toEqual({ success: true, updated: true });
        });

        it('should create waitlist user if email does not exist', async () => {
            vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);

            const result = await userService.joinWaitlist('new@example.com');

            expect(mockUserRepo.createWaitlistUser).toHaveBeenCalledWith('new@example.com');
            expect(result).toEqual({ success: true, created: true });
        });
    });

    describe('getWaitlistCount', () => {
        it('should add base count to real count', async () => {
            vi.mocked(mockUserRepo.getWaitlistCount).mockResolvedValue(10);

            const count = await userService.getWaitlistCount();

            expect(count).toBe(1243 + 10);
        });
    });
});
