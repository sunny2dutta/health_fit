import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UserController } from './UserController.js';
import { TestimonialController } from './TestimonialController.js';
import { UserService } from '../services/UserService.js';
import { TestimonialService } from '../services/TestimonialService.js';

type MockResponse = Response & {
  statusCode: number;
  jsonBody: unknown;
};

const createMockResponse = (): MockResponse => {
  const response = {
    statusCode: 200,
    jsonBody: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.jsonBody = payload;
      return this;
    },
  };

  return response as unknown as MockResponse;
};

describe('API controller contracts', () => {
  const userService = {
    joinWaitlist: vi.fn(),
    getWaitlistCount: vi.fn(),
  } as unknown as UserService;

  const testimonialService = {
    getPublishedTestimonials: vi.fn(),
  } as unknown as TestimonialService;

  const userController = new UserController(userService);
  const testimonialController = new TestimonialController(testimonialService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts a valid waitlist submission and returns the success payload', async () => {
    vi.mocked(userService.joinWaitlist).mockResolvedValue({
      success: true,
      message: 'Successfully added to the private waitlist.',
    });

    const req = {
      body: {
        email: 'new@example.com',
        phone: '+919999999999',
        fullName: 'Aarav Singh',
        city: 'Mumbai',
        track: 'Heart & Cardiometabolic',
        gender: 'Male',
      },
    } as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await userController.joinWaitlist(req, res, next);

    expect(userService.joinWaitlist).toHaveBeenCalledWith({
      email: 'new@example.com',
      phone: '+919999999999',
      fullName: 'Aarav Singh',
      city: 'Mumbai',
      track: 'Heart & Cardiometabolic',
      gender: 'Male',
    });
    expect(res.statusCode).toBe(200);
    expect(res.jsonBody).toEqual({
      success: true,
      message: 'Successfully added to the private waitlist.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('passes validation failures to next() for API error handling', async () => {
    const req = {
      body: {
        email: 'not-an-email',
        phone: '123',
      },
    } as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await userController.joinWaitlist(req, res, next);

    expect(userService.joinWaitlist).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(vi.mocked(next).mock.calls[0]?.[0]).toBeInstanceOf(ZodError);
  });

  it('returns the published waitlist count payload', async () => {
    vi.mocked(userService.getWaitlistCount).mockResolvedValue(118);

    const req = {} as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await userController.getWaitlistCount(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res.jsonBody).toEqual({ count: 118 });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns the published testimonials payload', async () => {
    vi.mocked(testimonialService.getPublishedTestimonials).mockResolvedValue([
      {
        id: 3,
        quote: 'Down 11 kg and sleeping properly for the first time in three years.',
        person: 'Anita S., 51 · Pune',
        detail: 'Perimenopause & Menopause',
        image_key: 'testimonial-3',
        sort_order: 3,
        is_published: true,
      },
    ]);

    const req = {} as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await testimonialController.getPublishedTestimonials(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res.jsonBody).toEqual({
      testimonials: [
        {
          id: 3,
          quote: 'Down 11 kg and sleeping properly for the first time in three years.',
          person: 'Anita S., 51 · Pune',
          detail: 'Perimenopause & Menopause',
          image_key: 'testimonial-3',
          sort_order: 3,
          is_published: true,
        },
      ],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
