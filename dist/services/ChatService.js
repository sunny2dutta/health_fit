export class ChatService {
    apiUrl;
    model;
    constructor() {
        this.apiUrl = 'https://api.fireworks.ai/inference/v1/chat/completions';
        this.model = 'accounts/fireworks/models/qwen3-30b-a3b';
    }
    async chat(messages, assessmentContext = null) {
        const apiKey = process.env.FIREWORKS_API_KEY;
        if (!apiKey) {
            throw new Error('Fireworks AI API key is not configured');
        }
        const systemMessage = {
            role: 'system',
            content: `You are Menvy, an AI-powered men's wellness companion. You provide personalized, supportive, and science-based health guidance focused on men's reproductive health and overall wellness.

Your role is to:
- Answer questions about men's health, wellness, and lifestyle
- Provide actionable, evidence-based advice
- Be supportive and non-judgmental
- Encourage healthy habits and professional medical consultation when appropriate
- Keep responses concise but helpful (2-3 paragraphs max)

Important guidelines:
- Never diagnose medical conditions
- Always recommend consulting a healthcare professional for medical concerns
- Focus on lifestyle, wellness, and general health education
- Be empathetic and understanding about sensitive health topics
- If the user asks about topics unrelated to health, wellness, or lifestyle, refuse to answer and respond with: "I can only answer health related questions. Do you have any health related questions?"

${assessmentContext ? `User's assessment context: ${assessmentContext}` : ''}`
        };
        const chatMessages = [systemMessage, ...messages];
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: 500,
                    temperature: 0.7,
                    messages: chatMessages
                })
            });
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Fireworks AI API error:', errorData);
                throw new Error(`AI service error: ${response.status}`);
            }
            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                let content = data.choices[0].message.content;
                // Remove <think>...</think> tags from Qwen model responses
                content = content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
                return content;
            }
            throw new Error('No response from AI service');
        }
        catch (error) {
            console.error('Chat service error:', error);
            throw error;
        }
    }
}
