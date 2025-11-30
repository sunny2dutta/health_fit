import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChatService } from './ChatService';

// Mock process.env
const originalEnv = process.env;

describe('ChatService', () => {
    let chatService: ChatService;

    beforeEach(() => {
        process.env = { ...originalEnv, FIREWORKS_API_KEY: 'test-key' };
        chatService = new ChatService();
        global.fetch = vi.fn();
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.clearAllMocks();
    });

    it('should throw error if API key is missing', async () => {
        process.env.FIREWORKS_API_KEY = '';
        await expect(chatService.chat([])).rejects.toThrow('Fireworks AI API key is not configured');
    });

    it('should return content from AI response', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: 'Hello there!' } }]
            })
        };
        vi.mocked(global.fetch).mockResolvedValue(mockResponse as any);

        const response = await chatService.chat([{ role: 'user', content: 'Hi' }]);

        expect(response).toBe('Hello there!');
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should remove <think> tags from response', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                choices: [{ message: { content: '<think>Processing...</think> Clean response' } }]
            })
        };
        vi.mocked(global.fetch).mockResolvedValue(mockResponse as any);

        const response = await chatService.chat([{ role: 'user', content: 'Hi' }]);

        expect(response).toBe('Clean response');
    });

    it('should throw error if API returns non-ok status', async () => {
        const mockResponse = {
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error'
        };
        vi.mocked(global.fetch).mockResolvedValue(mockResponse as any);

        await expect(chatService.chat([])).rejects.toThrow('AI service error: 500');
    });
});
