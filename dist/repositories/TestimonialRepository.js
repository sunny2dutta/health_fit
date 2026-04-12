import { AppError } from '../utils/AppError.js';
export class TestimonialRepository {
    supabase;
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }
    async getPublishedTestimonials() {
        const { data, error } = await this.supabase
            .from('testimonials')
            .select('id, quote, person, detail, image_key, sort_order, is_published')
            .eq('is_published', true)
            .order('sort_order', { ascending: true });
        if (error)
            throw new AppError(`DB Error: ${error.message}`, 500);
        return (data ?? []);
    }
}
