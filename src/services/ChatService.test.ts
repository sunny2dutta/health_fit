import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChatService } from './ChatService';

describe('ChatService', () => {
    let chatService: ChatService;

    beforeEach(() => {
        chatService = new ChatService();
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should post to the chat microservice with assessment context', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                success: true,
                message: 'Hello there!'
            })
        };
        vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

        await chatService.chat([{ role: 'user', content: 'Hi' }], 'score: 80');

        expect(global.fetch).toHaveBeenCalledWith(
            process.env.CHAT_SERVICE_URL || 'http://localhost:3001/chat',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'Hi' }],
                    assessmentContext: 'score: 80'
                })
            })
        );
    });

    it('should return content from AI response', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                success: true,
                message: 'Hello there!'
            })
        };
        vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

        const response = await chatService.chat([{ role: 'user', content: 'Hi' }]);

        expect(response.message).toBe('Hello there!');
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should return action data when provided', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                success: true,
                message: 'Clean response',
                action: { type: 'link', url: 'https://example.com' }
            })
        };
        vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

        const response = await chatService.chat([{ role: 'user', content: 'Hi' }]);

        expect(response.message).toBe('Clean response');
        expect(response.action).toEqual({ type: 'link', url: 'https://example.com' });
    });

    it('should throw error if chat service returns success false', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                success: false,
                message: 'No response available'
            })
        };
        vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

        await expect(chatService.chat([{ role: 'user', content: 'Hi' }])).rejects.toThrow(
            'No response available'
        );
    });

    it('should throw error if API returns non-ok status', async () => {
        const mockResponse = {
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error'
        };
        vi.mocked(global.fetch).mockResolvedValue(mockResponse as unknown as Response);

        await expect(chatService.chat([])).rejects.toThrow('Chat service error: 500');
    });
});
