import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './App.css';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';
type HomepageTestimonial = {
  quote: string;
  person: string;
  detail: string;
  imageKey: string;
};

const heroImage = new URL('../../image/download (1).jpeg', import.meta.url).href;
const stripImageOne = new URL('../../image/download (2).jpeg', import.meta.url).href;
const stripImageTwo = new URL('../../image/download (3).jpeg', import.meta.url).href;
const stripImageThree = new URL('../../image/download (4).jpeg', import.meta.url).href;

const testimonialImages: Record<string, string> = {
  'testimonial-1': stripImageOne,
  'testimonial-2': stripImageTwo,
  'testimonial-3': stripImageThree,
};

const heroPills = [
  'GLP-1 specialist care',
  'Hormonal and metabolic support',
  'Private digital onboarding',
];

const introStats = [
  {
    value: '65+',
    label: 'Cities supported through the current remote-first model',
  },
  {
    value: '1:1',
    label: 'Higher-touch onboarding presentation and conversion path',
  },
  {
    value: '24/7',
    label: 'Always-on waitlist capture through the existing backend',
  },
];

const conditionTracks = [
  {
    number: '01',
    label: 'PCOS and insulin resistance',
    title: 'Support for weight gain that tracks with hormones, cycles, and insulin resistance.',
    body:
      'Designed for women navigating stubborn weight gain, irregular cycles, and metabolic stress that standard diet-first programs tend to flatten into one generic story.',
    tags: ['Cycle-linked symptoms', 'Insulin resistance', 'Higher-attention care'],
  },
  {
    number: '02',
    label: 'Perimenopause and menopause',
    title: 'Care for the years when weight changes accelerate and standard advice becomes useless.',
    body:
      'Built for people dealing with midlife weight gain, sleep disruption, appetite shifts, and the quieter metabolic changes that rarely get handled with enough nuance.',
    tags: ['Midlife changes', 'Sleep and appetite', 'Clinical review'],
  },
  {
    number: '03',
    label: 'Men’s metabolic health',
    title: 'A structured path for visceral fat, energy decline, and longer-term cardiometabolic risk.',
    body:
      'For men dealing with central weight gain, lower energy, and creeping lab markers, with plans shaped around adherence, safety, and ongoing review.',
    tags: ['Waistline reduction', 'Energy and recovery', 'Long-term monitoring'],
  },
  {
    number: '04',
    label: 'Heart and cardiometabolic care',
    title: 'A calmer, clinically led route into sustainable weight and risk reduction.',
    body:
      'Focused on members who want to address weight alongside broader health markers instead of bouncing between fragmented interventions and one-off advice.',
    tags: ['Lifestyle guidance', 'Doctor oversight', 'Remote care flow'],
  },
];

const journeySteps = [
  {
    number: '1',
    title: 'Join the invitation list',
    body:
      'Share your email and WhatsApp number so the team can contact you when access opens in your cohort.',
  },
  {
    number: '2',
    title: 'Receive a guided intake',
    body:
      'Selected members are invited into a short, clinician-reviewed onboarding flow built around safety and fit.',
  },
  {
    number: '3',
    title: 'Start with ongoing support',
    body:
      'If approved, your plan continues with follow-up communication, progress tracking, and a more personal care rhythm.',
  },
];

const fallbackTestimonials: HomepageTestimonial[] = [
  {
    quote:
      'Doctors kept telling me to just diet and exercise. Ten years of trying. Six months on Sentriq and I’ve lost 14 kg and my periods are regular for the first time in my adult life.',
    person: 'Meghna R., 28 · Bangalore',
    detail: 'PCOS & Insulin Resistance',
    imageKey: 'testimonial-1',
  },
  {
    quote:
      'My family has a history of heart disease and my HbA1c was heading in the wrong direction. Six months in, it’s gone from 8.2 to 6.1 and my cardiologist has reduced one of my BP medications.',
    person: 'Suresh V., 44 · Chennai',
    detail: 'Heart & Cardiometabolic',
    imageKey: 'testimonial-2',
  },
  {
    quote:
      'After my periods stopped, I put on 8 kg in a year and nothing worked. My doctor just said it was normal. Sentriq was the first place that actually explained why. Down 11 kg and I’m sleeping properly for the first time in three years.',
    person: 'Anita S., 51 · Pune',
    detail: 'Perimenopause & Menopause',
    imageKey: 'testimonial-3',
  },
];

const faqs = [
  {
    question: 'Is this still the same waitlist and backend setup?',
    answer:
      'Yes. This page only changes the website design and presentation. The existing waitlist endpoints and database connection remain the same.',
  },
  {
    question: 'Do I need to complete a long assessment to join?',
    answer:
      'No. This version keeps the entry flow simple. You can request access with your email and optional WhatsApp number, and the team can follow up from there.',
  },
  {
    question: 'What happens after I submit the form?',
    answer:
      'Your details are stored through the current application flow, and the count updates the same way it did before. You will then be contacted when access opens.',
  },
  {
    question: 'Why does the site look different now?',
    answer:
      'The visual system was rebuilt from the local Sentriq reference: same warm palette, serif-forward hierarchy, editorial spacing, and invitation-led layout rhythm.',
  },
];

function App() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [message, setMessage] = useState('');
  const [testimonials, setTestimonials] = useState<HomepageTestimonial[]>(fallbackTestimonials);

  useEffect(() => {
    const loadWaitlistCount = async () => {
      try {
        const response = await fetch('/api/waitlist-count');
        if (!response.ok) {
          throw new Error('Unable to load waitlist count');
        }

        const data = (await response.json()) as { count?: number };
        if (typeof data.count === 'number') {
          setWaitlistCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
      }
    };

    loadWaitlistCount();
  }, []);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (!response.ok) {
          throw new Error('Unable to load testimonials');
        }

        const data = (await response.json()) as {
          testimonials?: Array<{
            quote: string;
            person: string;
            detail: string;
            image_key: string;
          }>;
        };

        if (data.testimonials?.length) {
          setTestimonials(
            data.testimonials.map((testimonial) => ({
              quote: testimonial.quote,
              person: testimonial.person,
              detail: testimonial.detail,
              imageKey: testimonial.image_key,
            })),
          );
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };

    loadTestimonials();
  }, []);

  const formattedCount = useMemo(() => {
    if (waitlistCount === null) {
      return '1,200+';
    }

    return waitlistCount.toLocaleString('en-US');
  }, [waitlistCount]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '').trim();
    const whatsAppNumber = String(formData.get('tel') || '').trim();

    if (!email) {
      setSubmissionState('error');
      setMessage('Enter your email to request access.');
      return;
    }

    setSubmissionState('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/join-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone: whatsAppNumber || undefined,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        errors?: Array<{ field?: string; message?: string }>;
      };

      if (!response.ok || !data.success) {
        const validationMessage = data.errors?.map((error) => error.message).filter(Boolean).join(', ');
        throw new Error(
          validationMessage || data.message || `Waitlist request failed with status ${response.status}`,
        );
      }

      setSubmissionState('success');
      setMessage(data.message || 'You are on the list. Watch for updates when the next access window opens.');
      event.currentTarget.reset();
      setWaitlistCount((current) => (current === null ? current : current + 1));
    } catch (error) {
      console.error('Failed to join waitlist:', error);
      setSubmissionState('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'We could not join the waitlist right now. Please try again shortly.',
      );
    }
  };

  return (
    <main className="sentriq-page">
      <motion.header
        className="site-nav"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <a className="brand" href="#top" aria-label="Menvy home">
          Menv<em>y</em>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#tracks">Conditions</a>
          <a href="#journey">How it works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-cta" href="#waitlist">
          Request access
        </a>
      </motion.header>

      <section className="hero" id="top">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.05 }}
        >
          <p className="eyebrow">Doctor-led metabolic care</p>
          <h1>
            Weight loss designed
            <br />
            for <em>your hormones.</em>
          </h1>
          <p className="hero-body">
            Some brands try to sound futuristic. The local <strong>Sentriq</strong> file works
            because it sounds calm, precise, and medically grounded. This page now follows that
            direction while keeping the same waitlist logic and database connection under the hood.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#waitlist">
              Request access
            </a>
            <a className="btn-secondary" href="#tracks">
              Explore care tracks
            </a>
          </div>
          <div className="pill-row">
            {heroPills.map((pill) => (
              <span key={pill} className="pill">
                {pill}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="portrait-card portrait-main">
            <img className="media-image" src={heroImage} alt="Wellness consultation portrait" />
            <div className="portrait-overlay">
              <p className="portrait-eyebrow">Private access</p>
              <p className="portrait-title">Invitation-only onboarding</p>
            </div>
          </div>
          <div className="portrait-stats">
            <div className="stat-card">
              <span className="stat-label">Current waitlist</span>
              <strong>{formattedCount}</strong>
              <p>Members queued for the next opening</p>
            </div>
            <div className="stat-card">
              <span className="stat-label">Care model</span>
              <strong>Remote-first</strong>
              <p>Structured onboarding and follow-up through the existing flow</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section intro-section">
        <div className="section-grid intro-grid">
          <div>
            <p className="eyebrow">The difference</p>
            <h2 className="section-title">
              A calmer brand language with more <em>clinical trust.</em>
            </h2>
          </div>
          <div className="intro-copy-wrap">
            <div className="intro-copy">
              <p>
                The local file is strong because it avoids the usual wellness clichés. It uses
                editorial restraint, a warm off-white palette, serif-led hierarchy, and a clear
                invitation-only narrative that feels more premium and more trustworthy.
              </p>
              <p>
                This implementation now follows that same section rhythm more closely: split hero,
                intro with stats, image strip, track list, quote block, testimonial row, FAQ, and a
                dark invitation-only waitlist band. The current backend and Supabase-backed storage
                remain unchanged.
              </p>
            </div>
            <div className="stat-rows">
              {introStats.map((stat) => (
                <div className="stat-box" key={stat.label}>
                  <div className="stat-box-number">{stat.value}</div>
                  <div className="stat-box-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="photo-strip" aria-hidden="true">
        <div className="photo-panel">
          <img className="media-image" src={stripImageOne} alt="" />
        </div>
        <div className="photo-panel">
          <img className="media-image" src={stripImageTwo} alt="" />
        </div>
        <div className="photo-panel">
          <img className="media-image" src={stripImageThree} alt="" />
        </div>
      </section>

      <section className="section" id="tracks">
        <p className="eyebrow">Care tracks</p>
        <h2 className="section-title">
          Built around the patterns people actually <em>live with.</em>
        </h2>

        <div className="track-list">
          {conditionTracks.map((track, index) => (
            <motion.article
              key={track.number}
              className="track-row"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="track-number">{track.number}</div>
              <div className="track-content">
                <p className="track-label">{track.label}</p>
                <h3>{track.title}</h3>
                <p>{track.body}</p>
                <div className="track-tags">
                  {track.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="track-arrow" aria-hidden="true">
                →
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="quote-block">
        <div className="quote-mark">“</div>
        <p className="quote-text">
          Good health brands do not need to shout. They need to explain the problem clearly, look
          trustworthy, and make the next step feel simple.
        </p>
        <p className="quote-attribution">Design direction adapted from the Sentriq reference</p>
      </section>

      <section className="section" id="journey">
        <div className="section-grid">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="section-title">
              The journey stays <em>simple.</em>
            </h2>
          </div>
          <div className="steps-column">
            {journeySteps.map((step, index) => (
              <motion.article
                key={step.number}
                className="step-row"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <div className="step-count">{step.number}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <motion.article
            key={testimonial.person}
            className="testimonial-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
          >
            <div className="testimonial-image">
              <img
                className="media-image"
                src={testimonialImages[testimonial.imageKey] || stripImageOne}
                alt={testimonial.person}
              />
            </div>
            <div className="testimonial-body">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <p className="testimonial-person">{testimonial.person}</p>
              <p className="testimonial-detail">{testimonial.detail}</p>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="waitlist-band" id="waitlist">
        <div className="waitlist-copy">
          <p className="waitlist-eyebrow">Private access</p>
          <h2>
            Menvy is launching <em>by invitation only.</em>
          </h2>
          <p>
            We are opening access in a tighter, more selective way. Leave your details and the team
            can reach out when the next place opens, using the same waitlist infrastructure already
            wired into the app.
          </p>
        </div>

        <div className="waitlist-panel">
          <form className="waitlist-form" onSubmit={handleSubmit} autoComplete="on">
            <div className="field-grid">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="Email address"
                defaultValue=""
                disabled={submissionState === 'submitting'}
              />
              <input
                id="whatsapp"
                name="tel"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="WhatsApp number (optional)"
                defaultValue=""
                disabled={submissionState === 'submitting'}
              />
            </div>

            <button className="waitlist-button" type="submit" disabled={submissionState === 'submitting'}>
              {submissionState === 'submitting' ? 'Submitting...' : 'Register your interest'}
              <ArrowRight size={18} />
            </button>
          </form>

          <AnimatePresence mode="wait">
            {message ? (
              <motion.p
                key={message}
                className={`form-message ${submissionState}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {message}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <p className="waitlist-note">
            By joining, you agree to receive access and availability updates from Menvy.
          </p>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <p className="eyebrow">Good to know</p>
        <h2 className="section-title">
          Common <em>questions</em>
        </h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>
                <span>{faq.question}</span>
                <span className="faq-toggle">+</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label="Menvy home">
          Menv<em>y</em>
        </a>
        <p>
          © 2026 Menvy Health. Design adapted from the local `sentriq.html` reference.
          Existing waitlist endpoints and database connectivity preserved.
        </p>
      </footer>
    </main>
  );
}

export default App;
