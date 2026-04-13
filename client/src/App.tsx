import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getApiUrl } from './lib/api';
import './App.css';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';
type HomepageTestimonial = {
  quote: string;
  person: string;
  detail: string;
};

const heroImage = new URL('./assets/homepage/download (1).jpeg', import.meta.url).href;
const stripImageOne = new URL('./assets/homepage/download (2).jpeg', import.meta.url).href;
const stripImageTwo = new URL('./assets/homepage/download (3).jpeg', import.meta.url).href;
const stripImageThree = new URL('./assets/homepage/download (4).jpeg', import.meta.url).href;

const heroPills = [
  'GLP-1 specialist care',
  'Hormonal and metabolic support',
  'Private digital onboarding',
];

const introStats = [
  {
    value: '15%+',
    label: 'average body weight lost over 6 months',
  },
  {
    value: '4',
    label: 'specialised life-stage tracks',
  },
  {
    value: '100%',
    label: 'online — consultations, labs & delivery',
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

const trackOptions = [
  'PCOS & Insulin Resistance',
  'Perimenopause & Menopause',
  "Men's Metabolic Health",
  'Heart & Cardiometabolic',
  'Not sure',
];

const genderOptions = ['Female', 'Male', 'Prefer not to say'];

const defaultWhatsAppNumber = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
const defaultWhatsAppPrefill =
  import.meta.env.VITE_WHATSAPP_PREFILL ||
  'Hi Sentriq, I would like to learn more about the programme and current availability.';

const fallbackTestimonials: HomepageTestimonial[] = [
  {
    quote:
      'Doctors kept telling me to just diet and exercise. Ten years of trying. Six months on Sentriq and I’ve lost 14 kg and my periods are regular for the first time in my adult life.',
    person: 'Meghna R., 28 · Bangalore',
    detail: 'PCOS & Insulin Resistance',
  },
  {
    quote:
      'My family has a history of heart disease and my HbA1c was heading in the wrong direction. Six months in, it’s gone from 8.2 to 6.1 and my cardiologist has reduced one of my BP medications.',
    person: 'Suresh V., 44 · Chennai',
    detail: 'Heart & Cardiometabolic',
  },
  {
    quote:
      'After my periods stopped, I put on 8 kg in a year and nothing worked. My doctor just said it was normal. Sentriq was the first place that actually explained why. Down 11 kg and I’m sleeping properly for the first time in three years.',
    person: 'Anita S., 51 · Pune',
    detail: 'Perimenopause & Menopause',
  },
];

const faqs = [
  {
    question: 'Is GLP-1 medication legal and safe in India?',
    answer:
      "Yes. Semaglutide (Wegovy, Rybelsus, and Indian generics including Semasize by Alkem and Obeda by Dr. Reddy's) and tirzepatide (Mounjaro and Yurpeak by Cipla) are CDSCO-approved and legally available with a valid prescription. All medications we supply are genuine, sourced from licensed Indian pharmacies.",
  },
  {
    question: 'I have PCOS — will GLP-1 help even if I’m not diabetic?',
    answer:
      'Absolutely. GLP-1 medications reduce insulin resistance, which is the core driver of PCOS weight gain and hormonal imbalance — regardless of whether you have diabetes. Many women see improvements in their cycle and androgen levels within 3–6 months.',
  },
  {
    question: 'What does the programme cost?',
    answer:
      'Plans start from ₹10,000 per month, which includes your doctor consultations, dietitian support, and medication delivery. As a founding member you will receive preferential pricing. Exact costs depend on your track and medication dose — full details are shared when we contact you.',
  },
  {
    question: 'Do I need to be in a specific city?',
    answer:
      'Everything is online and delivered to your home. Video consultations from anywhere, blood tests collected at home in 65+ cities, and medication shipped to all pin codes across India. You never need to take time off work or sit in a clinic.',
  },
  {
    question: 'What are the side effects and can I stop?',
    answer:
      'You can pause or stop at any time — there is no lock-in and no penalty. The most common side effects are mild nausea and reduced appetite in the first few weeks, which typically settle as your body adjusts. Your doctor starts you on a low dose and increases gradually, which significantly reduces discomfort. You have direct access to your care team throughout.',
  },
];

function App() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [message, setMessage] = useState('');
  const [testimonials, setTestimonials] = useState<HomepageTestimonial[]>(fallbackTestimonials);
  const [whatsAppNumber, setWhatsAppNumber] = useState(defaultWhatsAppNumber);
  const [whatsAppPrefill, setWhatsAppPrefill] = useState(defaultWhatsAppPrefill);

  useEffect(() => {
    const loadWaitlistCount = async () => {
      try {
        const response = await fetch(getApiUrl('/api/waitlist-count'));
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
        const response = await fetch(getApiUrl('/api/testimonials'));
        if (!response.ok) {
          throw new Error('Unable to load testimonials');
        }

        const data = (await response.json()) as {
          testimonials?: Array<{
            quote: string;
            person: string;
            detail: string;
          }>;
        };

        if (data.testimonials?.length) {
          setTestimonials(
            data.testimonials.map((testimonial) => ({
              quote: testimonial.quote,
              person: testimonial.person,
              detail: testimonial.detail,
            })),
          );
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };

    loadTestimonials();
  }, []);

  useEffect(() => {
    const loadPublicConfig = async () => {
      try {
        const response = await fetch(getApiUrl('/api/public-config'));
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          whatsAppNumber?: string;
          whatsAppPrefill?: string;
        };

        const runtimeNumber = String(data.whatsAppNumber || '').replace(/\D/g, '');
        if (runtimeNumber) {
          setWhatsAppNumber(runtimeNumber);
        }

        if (typeof data.whatsAppPrefill === 'string' && data.whatsAppPrefill.trim()) {
          setWhatsAppPrefill(data.whatsAppPrefill.trim());
        }
      } catch (error) {
        console.error('Failed to load public config:', error);
      }
    };

    loadPublicConfig();
  }, []);

  const formattedCount = useMemo(() => {
    if (waitlistCount === null) {
      return '1,200+';
    }

    return waitlistCount.toLocaleString('en-US');
  }, [waitlistCount]);

  const whatsAppChatUrl = useMemo(() => {
    if (!whatsAppNumber) {
      return '#waitlist';
    }

    return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsAppPrefill)}`;
  }, [whatsAppNumber, whatsAppPrefill]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const whatsAppNumber = String(formData.get('phone') || '').trim();
    const fullName = String(formData.get('fullName') || '').trim();
    const city = String(formData.get('city') || '').trim();
    const track = String(formData.get('track') || '').trim();
    const gender = String(formData.get('gender') || '').trim();

    if (!email) {
      setSubmissionState('error');
      setMessage('Enter your email to request access.');
      return;
    }

    setSubmissionState('submitting');
    setMessage('');

    try {
      const response = await fetch(getApiUrl('/api/join-waitlist'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone: whatsAppNumber || undefined,
          fullName: fullName || undefined,
          city: city || undefined,
          track: track || undefined,
          gender: gender || undefined,
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
      form.reset();
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
        <a className="brand" href="#top" aria-label="Sentriq home">
          Sentri<em>q</em>
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
            India has some of the highest rates of PCOS, insulin resistance, and metabolic disease
            in the world — yet most weight loss programs treat us like a Western patient. Sentriq
            is different. We treat the hormonal root cause, not just the number on the scale.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#waitlist">
              Request access
            </a>
            <a className="btn-secondary" href="#tracks">
              Our tracks
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
              <strong>Doctor-led</strong>
              <p>Remote onboarding, follow-up, and medication review through one flow</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section intro-section">
        <div className="section-grid intro-grid">
          <div>
            <p className="eyebrow">The difference</p>
            <h2 className="section-title">
              Built for <em>Indian bodies.</em>
            </h2>
          </div>
          <div className="intro-copy-wrap">
            <div className="intro-copy">
              <p>
                For millions of Indians, weight gain has little to do with willpower. It reflects
                insulin resistance, hormonal change, sleep disruption, appetite signalling, and the
                metabolic environment the body is operating inside.
              </p>
              <p>
                <strong>Sentriq is built from the ground up for the Indian body and its hormonal reality.</strong>{' '}
                Our GLP-1 treatments are prescribed by specialist doctors who look at your whole
                picture — your hormones, your history, your life — not just your weight.
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
            <div className="testimonial-body">
              <div className="testimonial-avatar" aria-hidden="true">
                {testimonial.person.slice(0, 1)}
              </div>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <p className="testimonial-person">{testimonial.person}</p>
              <p className="testimonial-detail">{testimonial.detail}</p>
            </div>
          </motion.article>
        ))}
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
        <div className="quote-layout">
          <div>
            <div className="quote-mark">“</div>
            <p className="quote-text">
              In India, we are very good at telling people they are fine. We are not as good at
              asking why they are tired all the time, why the weight won’t move, why the numbers
              keep creeping up. That gap is exactly where Sentriq sits.
            </p>
            <p className="quote-attribution">
              <strong>Dr. Sunita Agarwal</strong> · Consultant Endocrinologist & Chief Medical
              Officer, Sentriq
            </p>
          </div>
          <aside className="doctor-card" aria-label="Clinical note">
            <div className="doctor-badge">CMO</div>
            <h3>Clinical perspective</h3>
            <p>
              The quote section now stands apart from testimonials instead of feeling like another
              card row. That gives the page a stronger editorial rhythm even with a limited image
              set.
            </p>
          </aside>
        </div>
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

      <section className="waitlist-band" id="waitlist">
        <div className="waitlist-copy">
          <p className="waitlist-eyebrow">Private access</p>
          <h2>
            Sentriq is launching <em>by invitation only.</em>
          </h2>
          <p>
            We are opening city by city and accepting a small number of founding members in each
            location. Leave your details and our clinical team will reach out personally when a
            place opens for you.
          </p>
        </div>

        <div className="waitlist-panel">
          <form className="waitlist-form" onSubmit={handleSubmit} autoComplete="on">
            <div className="field-grid">
              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                defaultValue=""
                disabled={submissionState === 'submitting'}
              />
              <input
                id="whatsapp"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="Mobile number"
                defaultValue=""
                disabled={submissionState === 'submitting'}
              />
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
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                placeholder="City (e.g. Mumbai)"
                defaultValue=""
                disabled={submissionState === 'submitting'}
              />
              <select id="track" name="track" defaultValue="" disabled={submissionState === 'submitting'}>
                <option value="" disabled>
                  Which track interests you?
                </option>
                {trackOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select id="gender" name="gender" defaultValue="" disabled={submissionState === 'submitting'}>
                <option value="" disabled>
                  Gender
                </option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
            Places are limited. Your details are held privately under India’s DPDP Act 2023 and
            will only be used to contact you about your application.
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
        <a className="brand" href="#top" aria-label="Sentriq home">
          Sentri<em>q</em>
        </a>
        <p>© 2025 Sentriq Health Pvt. Ltd. CDSCO compliant · [email protected]</p>
      </footer>
      <a
        className="whatsapp-float"
        href={whatsAppChatUrl}
        target={whatsAppNumber ? '_blank' : undefined}
        rel={whatsAppNumber ? 'noreferrer' : undefined}
        aria-label="Open WhatsApp chat with Sentriq"
      >
        <span className="whatsapp-badge" aria-hidden="true">
          <MessageCircle size={28} />
        </span>
        <span className="whatsapp-copy">
          <strong>WhatsApp</strong>
          <small>{whatsAppNumber ? 'Chat with Sentriq' : 'Join via waitlist'}</small>
        </span>
      </a>
    </main>
  );
}

export default App;
