export interface ChatMessage {
    role: string;
    content: string;
}



export class ChatService {
    constructor() {
    }

    async chat(messages: ChatMessage[], assessmentContext: string | null = null): Promise<{ message: string, action?: any }> {
        const chatServiceUrl = process.env.CHAT_SERVICE_URL || 'http://localhost:3001/chat';

        try {
            const response = await fetch(chatServiceUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages,
                    assessmentContext
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Chat microservice error:', errorData);
                throw new Error(`Chat service error: ${response.status}`);
            }

            const data = await response.json() as { success: boolean, message: string, action?: any };

            if (data.success) {
                return {
                    message: data.message,
                    action: data.action
                };
            }

            throw new Error(data.message || 'Unknown error from chat service');
        } catch (error) {
            console.error('Chat service error:', error);
            throw error;
        }
    }
}
