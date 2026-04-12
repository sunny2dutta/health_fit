import { TestimonialRepository, type Testimonial } from '../repositories/TestimonialRepository.js';

export class TestimonialService {
    private testimonialRepo: TestimonialRepository;

    constructor(testimonialRepository: TestimonialRepository) {
        this.testimonialRepo = testimonialRepository;
    }

    async getPublishedTestimonials(): Promise<Testimonial[]> {
        return this.testimonialRepo.getPublishedTestimonials();
    }
}
