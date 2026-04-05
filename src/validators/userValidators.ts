import { z } from 'zod';

export const waitlistSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(7, "WhatsApp number must be at least 7 digits").max(20, "WhatsApp number is too long").optional()
});
export type WaitlistInput = z.infer<typeof waitlistSchema>;
