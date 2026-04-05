import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
} from 'lucide-react';
import './App.css';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const socialProof = [
  'Physician-reviewed intake',
  'Priority stock notifications',
  'White-glove onboarding',
];

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Private clinical matching',
    description:
      'Every invitation is reviewed to preserve a discreet, high-attention onboarding experience.',
  },
  {
    icon: Clock3,
    title: 'Priority access windows',
    description:
      'Members on the list receive first notice when limited GLP-1 inventory opens.',
  },
  {
    icon: TrendingDown,
    title: 'Outcome-focused plans',
    description:
      'The experience is designed around sustainable metabolic support, not mass-market churn.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Join the private list',
    body: 'Reserve your place for early access to our premium GLP-1 sourcing and onboarding program.',
  },
  {
    number: '02',
    title: 'Receive your invitation',
    body: 'Selected members are contacted in release order with concierge next steps and access timing.',
  },
  {
    number: '03',
    title: 'Begin with white-glove support',
    body: 'From intake through ongoing check-ins, the experience stays streamlined, discreet, and personal.',
  },
];

function App() {
  const [email, setEmail] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [message, setMessage] = useState('');

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

  const formattedCount = useMemo(() => {
    if (waitlistCount === null) {
      return '1,200+';
    }

    return waitlistCount.toLocaleString('en-US');
  }, [waitlistCount]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setSubmissionState('error');
      setMessage('Enter your email to reserve a private invitation.');
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
          email: email.trim(),
          phone: whatsAppNumber.trim() || undefined,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        status?: string;
        errors?: Array<{ field?: string; message?: string }>;
      };

      if (!response.ok || !data.success) {
        const validationMessage = data.errors?.map((error) => error.message).filter(Boolean).join(', ');
        throw new Error(
          validationMessage ||
            data.message ||
            `Waitlist request failed with status ${response.status}`,
        );
      }

      setSubmissionState('success');
      setMessage(data.message || 'You are in. Watch your inbox for first-access updates and invitation windows.');
      setEmail('');
      setWhatsAppNumber('');
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
    <main className="premium-page">
      <section className="hero-shell">
        <motion.header
          className="topbar"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              M
            </div>
            <div>
              <p className="eyebrow">Private metabolic access</p>
              <h1 className="brand-name">Menvy GLP-1 Concierge</h1>
            </div>
          </div>
          <a className="ghost-link" href="#waitlist">
            Join waitlist
          </a>
        </motion.header>

        <section className="hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="pill">
              <Sparkles size={16} />
              Limited-release GLP-1 reseller access
            </div>
            <h2>Exclusive access to premium GLP-1 sourcing, without the questionnaire.</h2>
            <p className="hero-text">
              Menvy is now a high-touch GLP-1 reseller experience built for clients who want speed,
              discretion, and a more elevated path into metabolic care. Join the private waitlist to
              be considered for priority release.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#waitlist">
                Reserve private access
                <ArrowRight size={18} />
              </a>
              <p className="micro-proof">
                <Star size={15} />
                Trusted by {formattedCount} members already in line for release access
              </p>
            </div>

            <div className="proof-strip">
              {socialProof.map((item) => (
                <span key={item}>
                  <Check size={14} />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.aside
            className="hero-panel"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="panel-head">
              <p className="panel-label">Current release</p>
              <p className="panel-availability">Invitation-only onboarding</p>
            </div>

            <div className="metric-card">
              <span>Private waitlist</span>
              <strong>{formattedCount}</strong>
              <p>Members awaiting the next allocation window</p>
            </div>

            <div className="panel-list">
              <div>
                <span>Access model</span>
                <strong>Curated reseller network</strong>
              </div>
              <div>
                <span>Member experience</span>
                <strong>Concierge-led and discreet</strong>
              </div>
              <div>
                <span>Entry path</span>
                <strong>Waitlist only</strong>
              </div>
            </div>
          </motion.aside>
        </section>
      </section>

      <section className="content-band">
        <motion.div
          className="section-intro"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow">Designed for a premium audience</p>
          <h3>Why this experience feels different</h3>
        </motion.div>

        <div className="highlights-grid">
          {highlights.map(({ icon: Icon, title, description }, index) => (
            <motion.article
              className="highlight-card"
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <div className="icon-wrap">
                <Icon size={22} />
              </div>
              <h4>{title}</h4>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="waitlist-section" id="waitlist">
        <motion.div
          className="waitlist-copy"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow">Private waitlist</p>
          <h3>Reserve your place before the next opening disappears.</h3>
          <p>
            This is the only path into the next release. The list is intentionally selective to keep
            response times, allocation updates, and onboarding support at a premium level.
          </p>
          <ul className="benefit-list">
            <li>Early access to future GLP-1 release windows</li>
            <li>Priority notifications before inventory is publicly discussed</li>
            <li>A cleaner, faster intake experience with no questionnaire barrier</li>
          </ul>
        </motion.div>

        <motion.div
          className="waitlist-card"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="waitlist-card-header">
            <span className="mini-badge">Invitation-only</span>
            <h4>Join the premium list</h4>
            <p>Enter your best email for first-access alerts and concierge release updates.</p>
          </div>

          <div className="whatsapp-promo">
            <p className="whatsapp-title">Join our exclusive WhatsApp group</p>
            <p className="whatsapp-copy">
              Add your number for priority drops, insider release alerts, and fast-track access updates.
            </p>
          </div>

          <form className="waitlist-form" onSubmit={handleSubmit} autoComplete="on">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submissionState === 'submitting'}
            />
            <label htmlFor="whatsapp" className="sr-only">
              WhatsApp number
            </label>
            <input
              id="whatsapp"
              name="tel"
              type="tel"
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="WhatsApp number (optional)"
              value={whatsAppNumber}
              onChange={(event) => setWhatsAppNumber(event.target.value)}
              disabled={submissionState === 'submitting'}
            />
            <button className="primary-button" type="submit" disabled={submissionState === 'submitting'}>
              {submissionState === 'submitting' ? 'Securing your spot...' : 'Request invitation'}
              <ArrowRight size={18} />
            </button>
          </form>

          <AnimatePresence mode="wait">
            {message ? (
              <motion.p
                key={message}
                className={`form-message ${submissionState}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {message}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <p className="fine-print">
            By joining, you agree to receive release and availability communications from Menvy.
          </p>
        </motion.div>
      </section>

      <section className="content-band process-band">
        <div className="section-intro">
          <p className="eyebrow">How access works</p>
          <h3>A simpler path, elevated from first click to first shipment</h3>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              className="step-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <span className="step-number">{step.number}</span>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
