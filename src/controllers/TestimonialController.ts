import { Request, Response, NextFunction } from 'express';
import { TestimonialService } from '../services/TestimonialService.js';

export class TestimonialController {
    private testimonialService: TestimonialService;

    constructor(testimonialService: TestimonialService) {
        this.testimonialService = testimonialService;
    }

    getPublishedTestimonials = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const testimonials = await this.testimonialService.getPublishedTestimonials();
            res.status(200).json({ testimonials });
        } catch (error) {
            next(error);
        }
    };
}
