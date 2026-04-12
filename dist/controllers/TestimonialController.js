export class TestimonialController {
    testimonialService;
    constructor(testimonialService) {
        this.testimonialService = testimonialService;
    }
    getPublishedTestimonials = async (_req, res, next) => {
        try {
            const testimonials = await this.testimonialService.getPublishedTestimonials();
            res.status(200).json({ testimonials });
        }
        catch (error) {
            next(error);
        }
    };
}
