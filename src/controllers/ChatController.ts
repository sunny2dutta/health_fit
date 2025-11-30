import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ChatService } from '../services/ChatService.js';

export class ChatController {
    private chatService: ChatService;

    constructor(chatService: ChatService) {
        this.chatService = chatService;
    }

    chat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { messages, assessmentContext } = req.body;

            if (!messages || !Array.isArray(messages) || messages.length === 0) {
                throw new AppError("Messages array is required", 400);
            }

            const response = await this.chatService.chat(messages, assessmentContext);

            return res.status(200).json({
                success: true,
                message: response
            });
        } catch (error: any) {
            console.error('Chat endpoint error:', error);

            if (error.message === 'Fireworks AI API key is not configured') {
                return res.status(503).json({
                    success: false,
                    message: "Chat service is temporarily unavailable. Please try again later."
                });
            }

            if (error.message.includes('AI service error: 401') || error.message.includes('AI service error: 403')) {
                return res.status(503).json({
                    success: false,
                    message: "Chat service is experiencing authentication issues. Please contact support."
                });
            }

            if (error.message.includes('AI service error')) {
                return res.status(503).json({
                    success: false,
                    message: "Chat service is temporarily unavailable. Please try again in a moment."
                });
            }

            return next(error);
        }
    };
}
