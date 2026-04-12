export class TestimonialService {
    testimonialRepo;
    constructor(testimonialRepository) {
        this.testimonialRepo = testimonialRepository;
    }
    async getPublishedTestimonials() {
        return this.testimonialRepo.getPublishedTestimonials();
    }
}
