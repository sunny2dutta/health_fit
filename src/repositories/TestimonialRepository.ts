import { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';

export interface Testimonial {
    id: number;
    quote: string;
    person: string;
    detail: string;
    image_key: string;
    sort_order: number;
    is_published: boolean;
}

export class TestimonialRepository {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async getPublishedTestimonials(): Promise<Testimonial[]> {
        const { data, error } = await this.supabase
            .from('testimonials')
            .select('id, quote, person, detail, image_key, sort_order, is_published')
            .eq('is_published', true)
            .order('sort_order', { ascending: true });

        if (error) throw new AppError(`DB Error: ${error.message}`, 500);
        return (data ?? []) as Testimonial[];
    }
}
