CREATE TABLE IF NOT EXISTS public.testimonials (
    id BIGSERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    person TEXT NOT NULL,
    detail TEXT NOT NULL,
    image_key TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published_sort
ON public.testimonials (is_published, sort_order);

INSERT INTO public.testimonials (quote, person, detail, image_key, sort_order, is_published)
VALUES
    (
        'Doctors kept telling me to just diet and exercise. Ten years of trying. Six months on Sentriq and I''ve lost 14 kg and my periods are regular for the first time in my adult life.',
        'Meghna R., 28 · Bangalore',
        'PCOS & Insulin Resistance',
        'testimonial-1',
        1,
        TRUE
    ),
    (
        'My family has a history of heart disease and my HbA1c was heading in the wrong direction. Six months in, it''s gone from 8.2 to 6.1 and my cardiologist has reduced one of my BP medications.',
        'Suresh V., 44 · Chennai',
        'Heart & Cardiometabolic',
        'testimonial-2',
        2,
        TRUE
    ),
    (
        'After my periods stopped, I put on 8 kg in a year and nothing worked. My doctor just said it was normal. Sentriq was the first place that actually explained why. Down 11 kg and I''m sleeping properly for the first time in three years.',
        'Anita S., 51 · Pune',
        'Perimenopause & Menopause',
        'testimonial-3',
        3,
        TRUE
    )
ON CONFLICT DO NOTHING;
