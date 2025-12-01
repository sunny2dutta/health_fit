import { AppError } from '../utils/AppError.js';
export class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    chat = async (req, res, next) => {
        try {
            const { messages, assessmentContext } = req.body;
            const user = req.user; // Authenticated user from middleware
            // Optional: You can now use user.id to save chat history or personalize response
            console.log(`Chat request from user: ${user.id}`);
            if (!messages || !Array.isArray(messages) || messages.length === 0) {
                throw new AppError("Messages array is required", 400);
            }
            const response = await this.chatService.chat(messages, assessmentContext);
            return res.status(200).json({
                success: true,
                message: response
            });
        }
        catch (error) {
            console.error('Chat endpoint error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage === 'Fireworks AI API key is not configured') {
                return res.status(503).json({
                    success: false,
                    message: "Chat service is temporarily unavailable. Please try again later."
                });
            }
            if (errorMessage.includes('AI service error: 401') || errorMessage.includes('AI service error: 403')) {
                return res.status(503).json({
                    success: false,
                    message: "Chat service is experiencing authentication issues. Please contact support."
                });
            }
            if (errorMessage.includes('AI service error')) {
                return res.status(503).json({
                    success: false,
                    message: "Chat service is temporarily unavailable. Please try again in a moment."
                });
            }
            return next(error);
        }
    };
}
