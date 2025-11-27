import { AppError } from '../utils/AppError.js';

export class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }

    chat = async (req, res, next) => {
        try {
            const { messages, assessmentContext } = req.body;
            
            if (!messages || !Array.isArray(messages) || messages.length === 0) {
                throw new AppError("Messages array is required", 400);
            }

            const response = await this.chatService.chat(messages, assessmentContext);
            
            res.status(200).json({
                success: true,
                message: response
            });
        } catch (error) {
            console.error('Chat endpoint error:', error);
            
            if (error.message === 'Fireworks AI API key is not configured') {
                return res.status(503).json({
                    success: false,
                    message: "Chat service is temporarily unavailable. Please try again later."
                });
            }
            
            next(error);
        }
    };
}
