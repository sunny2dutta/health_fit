import { z } from 'zod';

export const emailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" })
});

export const personalInfoSchema = z.object({
    user_id: z.number(),
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    date_of_birth: z.string().refine((date: string) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    phone: z.string().min(10, "Phone number must be at least 10 digits")
});

export const healthConcernsSchema = z.object({
    user_id: z.number(),
    concerns: z.array(z.string()).min(1, "At least one concern must be selected")
});

export const servicePreferencesSchema = z.object({
    user_id: z.number(),
    preferences: z.array(z.string()).min(1, "At least one preference must be selected")
});

export const assessmentSchema = z.object({
    user_id: z.number(),
    score: z.number().min(0).max(100),
    answers: z.array(z.object({
        question: z.string(),
        selectedAnswer: z.string(),
        score: z.number()
    }))
});

export type EmailInput = z.infer<typeof emailSchema>;
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type HealthConcernsInput = z.infer<typeof healthConcernsSchema>;
export type ServicePreferencesInput = z.infer<typeof servicePreferencesSchema>;
export type AssessmentInput = z.infer<typeof assessmentSchema>;
