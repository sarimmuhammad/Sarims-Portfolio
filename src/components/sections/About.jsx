import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/animations'
import profilePhoto from '../../assets/saaram.jpg'

const HIGHLIGHTS = [
  'AI products that automate entire business workflows',
  'Custom voice agents built from scratch — no templates',
  'RAG systems trained on real business data',
  'Multi-LLM architectures that pick the best model per task',
]

export default function About() {
  const [imgError, setImgError] = useState(false)
  const sectionRef  = useRef(null)
  const leftRef     = useRef(null)
  const rightRef    = useRef(null)
  const photoRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      )
      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      )

      gsap.fromTo(photoRef.current,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power2.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} style={{ padding: '8rem 0', background: 'var(--bg2)' }}>
      <div className="container">
        <div className="about-grid">

          {/* Left — photo */}
          <div ref={leftRef} className="photo-col" style={{ opacity: 0 }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: 360 }}>
              {/* Photo frame */}
              <div ref={photoRef} style={{
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid var(--border2)',
                background: 'var(--bg3)',
                position: 'relative'
              }}>
                {/* Profile photo with fallback */}
                {!imgError ? (
                  <img
                    src={profilePhoto}
                    alt="Saaram"
                    onError={() => setImgError(true)}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center',
                      display: 'block'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #0a2e1a 0%, #0c1a2e 100%)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{ fontSize: '4rem' }}>👤</div>
                    <div style={{
                      fontSize: '11px', fontFamily: 'var(--font-mono)',
                      color: 'var(--text3)', textAlign: 'center', padding: '0 1rem'
                    }}>
                      Photo not found<br />
                      <code>src/assets/saaram.jpg</code>
                    </div>
                  </div>
                )}

                {/* Scan line animation */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, var(--em), transparent)',
                  animation: 'scanLine 3s ease-in-out infinite',
                  opacity: 0.6
                }} />
              </div>

              {/* Emerald ring */}
              <div style={{
                position: 'absolute', inset: -8,
                borderRadius: 32,
                border: '1px solid rgba(52,211,153,0.2)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', inset: -16,
                borderRadius: 36,
                border: '1px solid rgba(52,211,153,0.08)',
                pointerEvents: 'none'
              }} />

              {/* Location badge */}
              <div className="glass location-badge" style={{
                position: 'absolute', bottom: -16, right: -16,
                padding: '8px 16px', borderRadius: 100,
                fontSize: '12px', fontFamily: 'var(--font-mono)',
                display: 'flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap'
              }}>
                <span>📍</span>
                <span style={{ color: 'var(--text2)' }}>Pakistan → Global</span>
              </div>
            </div>
          </div>

          {/* Right — bio */}
          <div ref={rightRef} style={{ opacity: 0 }}>
            <div className="section-eyebrow" style={{ marginBottom: '1.5rem' }}>about</div>

            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '1.5rem', lineHeight: 1.15 }}>
              I'm not an agency.<br />
              <span className="gradient-text">I'm one builder.</span>
            </h2>

            <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem' }}>
              Obsessed with turning business problems into AI products. I work at the intersection of
              LLM engineering, automation, and product design — building systems that actually ship
              and scale.
            </p>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2.5rem' }}>
              Based in Pakistan, working with clients globally. Whether it's a chatbot that handles
              10,000 DMs a day or a RAG system trained on your company's entire knowledge base —
              I build it from scratch.
            </p>

            {/* Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {HIGHLIGHTS.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--em-dim)', border: '1px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 2
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--em)', display: 'block' }} />
                  </span>
                  <span style={{ color: 'var(--text2)', lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="social-links" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="https://github.com/sarimmuhammad" target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text2)', textDecoration: 'none', fontSize: '13px',
                transition: 'all 0.2s', fontWeight: 500
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--em)'; e.currentTarget.style.color='var(--em)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text2)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub ↗
              </a>
              <a href="https://www.linkedin.com/in/muhammad-saaram-710296322" target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text2)', textDecoration: 'none', fontSize: '13px',
                transition: 'all 0.2s', fontWeight: 500
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#60a5fa'; e.currentTarget.style.color='#60a5fa' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text2)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0.8; }
          50%  { top: 98%; opacity: 0.4; }
          100% { top: 0%; opacity: 0.8; }
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 5rem;
          align-items: center;
        }

        .photo-col {
          display: flex;
          justify-content: flex-start;
        }

        @media (max-width: 768px) {
          #about {
            padding: 4rem 0 !important;
          }
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .photo-col {
            justify-content: center !important;
          }
          .photo-col > div {
            max-width: 280px !important;
          }
          .location-badge {
            right: 0px !important;
            font-size: 11px !important;
          }
          .social-links {
            flex-direction: column !important;
          }
          .social-links a {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          #about {
            padding: 3rem 0 !important;
          }
          .photo-col > div {
            max-width: 240px !important;
          }
        }
      `}</style>
    </section>
  )
}