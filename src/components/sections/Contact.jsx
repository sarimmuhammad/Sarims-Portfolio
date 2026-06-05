import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/animations'
import emailjs from '@emailjs/browser'

// ─── EMAILJS SETUP (5 minutes) ────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_6nxeoha'
const EMAILJS_TEMPLATE_ID = 'template_27jhj5t'
const EMAILJS_PUBLIC_KEY  = 'P9DERpA1aneBXkKNH'
// ─────────────────────────────────────────────────────────────────────────────

// ─── Particle burst component ─────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360
    const dist  = 60 + Math.random() * 60
    const size  = 4 + Math.random() * 5
    const colors = ['#34d399', '#6ee7b7', '#a7f3d0', '#ffffff', '#10b981']
    return { angle, dist, size, color: colors[i % colors.length], delay: Math.random() * 0.3 }
  })

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180
        const tx  = Math.cos(rad) * p.dist
        const ty  = Math.sin(rad) * p.dist
        return (
          <div key={i} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            transform: 'translate(-50%, -50%)',
            animation: `particle-fly 0.9s cubic-bezier(0.22,1,0.36,1) ${p.delay}s both`,
            '--tx': `${tx}px`, '--ty': `${ty}px`,
            boxShadow: `0 0 6px ${p.color}`,
          }} />
        )
      })}
    </div>
  )
}

// ─── Animated checkmark SVG ───────────────────────────────────────────────────
function AnimatedCheck() {
  return (
    <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 1.5rem' }}>
      {/* Pulse ring */}
      <div style={{
        position: 'absolute', inset: -8,
        borderRadius: '50%',
        border: '2px solid rgba(52,211,153,0.4)',
        animation: 'ring-pulse 1.8s ease-out 0.3s infinite',
      }} />
      {/* Outer glow circle */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)',
        animation: 'glow-scale 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
      }} />
      {/* Circle + check SVG */}
      <svg viewBox="0 0 80 80" width="80" height="80" style={{ position: 'relative', zIndex: 1 }}>
        <circle
          cx="40" cy="40" r="34"
          fill="none"
          stroke="rgba(52,211,153,0.15)"
          strokeWidth="2"
        />
        <circle
          cx="40" cy="40" r="34"
          fill="none"
          stroke="#34d399"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="213.6"
          strokeDashoffset="213.6"
          style={{ animation: 'draw-circle 0.6s cubic-bezier(0.65,0,0.35,1) 0.1s forwards' }}
        />
        <polyline
          points="24,41 35,53 56,28"
          fill="none"
          stroke="#34d399"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="50"
          strokeDashoffset="50"
          style={{ animation: 'draw-check 0.4s cubic-bezier(0.65,0,0.35,1) 0.65s forwards' }}
        />
      </svg>
    </div>
  )
}

// ─── Success card ─────────────────────────────────────────────────────────────
function SuccessCard({ onReset }) {
  return (
    <>
      <style>{`
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes glow-scale {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes ring-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes particle-fly {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
        }
        @keyframes card-in {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer-slide {
          0%   { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
        .success-btn:hover {
          background: rgba(52,211,153,0.15) !important;
          color: #34d399 !important;
          border-color: rgba(52,211,153,0.5) !important;
          transform: translateY(-1px);
        }
      `}</style>

      <div style={{
        position: 'relative',
        padding: '3rem 2.5rem',
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(52,211,153,0.06) 0%, var(--surface) 60%)',
        border: '1px solid rgba(52,211,153,0.25)',
        textAlign: 'center',
        overflow: 'hidden',
        animation: 'card-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        boxShadow: '0 0 60px rgba(52,211,153,0.08), 0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Shimmer sweep */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          overflow: 'hidden', borderRadius: 24, pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.08), transparent)',
            animation: 'shimmer-slide 1.2s ease-out 0.4s both',
          }} />
        </div>

        {/* Particle burst */}
        <Particles />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AnimatedCheck />

          <h3 style={{
            fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.6rem',
            background: 'linear-gradient(135deg, #ffffff 30%, #34d399)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'fade-up 0.5s ease 0.9s both',
          }}>
            Message received!
          </h3>

          <p style={{
            color: 'var(--text2)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto',
            fontSize: '0.95rem',
            animation: 'fade-up 0.5s ease 1.05s both',
          }}>
            I'll hit you back within{' '}
            <span style={{ color: '#34d399', fontWeight: 600 }}>24 hours.</span>
            {' '}Time to build something great.
          </p>

          {/* Divider */}
          <div style={{
            width: 40, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)',
            margin: '1.5rem auto',
            animation: 'fade-up 0.5s ease 1.15s both',
          }} />

          <button
            className="success-btn"
            onClick={onReset}
            style={{
              padding: '10px 28px', borderRadius: 10,
              border: '1px solid rgba(52,211,153,0.25)',
              background: 'rgba(52,211,153,0.08)',
              color: 'rgba(52,211,153,0.8)',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
              animation: 'fade-up 0.5s ease 1.25s both',
            }}
          >
            Send another →
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Main Contact component ───────────────────────────────────────────────────
export default function Contact() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const formRef    = useRef(null)

  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
      )
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    setErrMsg('')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message, reply_to: form.email },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('done')
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
      setErrMsg(err?.text || 'Send failed. Check your EmailJS keys in Contact.jsx.')
    }
  }

  const inputStyle = {
    width: '100%', padding: '14px 18px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 12, color: 'var(--text)',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
  }

  const labelStyle = {
    fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    display: 'block', marginBottom: '0.5rem'
  }

  return (
    <section id="contact" ref={sectionRef} style={{ padding: '8rem 0 6rem', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Title */}
        <div ref={titleRef} style={{ opacity: 0, textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>contact</div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Got an idea that needs AI?{' '}
            <span className="gradient-text">Let's build it.</span>
          </h2>
          <p style={{ color: 'var(--text2)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Tell me what you're building. I'll tell you exactly how AI can make it 10x better.
          </p>
        </div>

        {/* Form card */}
        <div ref={formRef} style={{ opacity: 0, maxWidth: 560, margin: '0 auto' }}>
          {status === 'done' ? (
            <SuccessCard onReset={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }) }} />
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input type="text" name="from_name" placeholder="Your name"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--border2)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" name="from_email" placeholder="your@email.com"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--border2)'}
                    onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>What are you building?</label>
                <textarea rows={5} name="message"
                  placeholder="Describe your project — the problem, what you need, your timeline..."
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }}
                  onFocus={e => e.target.style.borderColor = 'var(--border2)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border)'}
                  required
                />
              </div>

              {status === 'error' && (
                <div style={{
                  padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171', fontSize: '13px', lineHeight: 1.6
                }}>
                  ⚠️ {errMsg}
                </div>
              )}

              <button type="submit" disabled={status === 'sending'} style={{
                padding: '16px', borderRadius: 12,
                background: status === 'sending' ? 'var(--em-dim)' : 'var(--em)',
                border: 'none',
                color: status === 'sending' ? 'var(--em)' : 'var(--bg)',
                fontSize: '1rem', fontWeight: 700, transition: 'all 0.2s',
                boxShadow: '0 0 30px rgba(52,211,153,0.3)',
                cursor: status === 'sending' ? 'wait' : 'pointer'
              }}>
                {status === 'sending' ? 'Sending...' : 'Send message →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text3)' }}>
                Usually responds within 24 hours
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '6rem', paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem'
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem' }}>
            saaram<span style={{ color: 'var(--em)' }}>.</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { label: 'GitHub',   href: 'https://github.com/sarimmuhammad'   },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-saaram-710296322' },
              { label: 'Email',    href: 'mailto:sarimmuhammad711@gmail.com' },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                fontSize: '13px', color: 'var(--text3)', textDecoration: 'none', transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--em)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            © 2026 Muhammad Saaram
          </div>
        </div>
      </div>
    </section>
  )
}
