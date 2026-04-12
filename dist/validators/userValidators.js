import { z } from 'zod';
export const waitlistSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters").max(120, "Full name is too long").optional(),
    city: z.string().max(120, "City is too long").optional(),
    track: z.string().max(120, "Track is too long").optional(),
    gender: z.string().max(40, "Gender is too long").optional(),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(7, "WhatsApp number must be at least 7 digits").max(20, "WhatsApp number is too long").optional()
});
