import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  { label: 'RAG Knowledge Base', desc: 'Ingests university docs, PDFs, syllabi',       icon: '' },
  { label: 'AI Tutor',           desc: 'GPT-4 + Claude answer student questions',       icon: '' },
  { label: 'Auto Assignments',   desc: 'Drafts, explains, checks student work',         icon: '' },
  { label: 'Multi-LLM',          desc: 'Switches models based on task complexity',      icon: '' },
]

const TECH = ['OpenAI', 'Groq', 'LangChain', 'RAG', 'React.js', 'Python', 'Chromadb', 'FastAPI']

const STATS = [
  { val: 3,   suffix: '+', label: 'universities'  },
  { val: 500, suffix: '+', label: 'queries / day' },
  { val: 90,  suffix: '%', label: 'accuracy'      },
]

const ARCH_NODES = [
  { x: 100, y: 20,  w: 120, h: 40, label: 'Student Input',  color: '#0d1f17', text: '#34d399', glow: '#34d399' },
  { x: 20,  y: 110, w: 120, h: 40, label: 'LLM Router',     color: '#0d1525', text: '#60a5fa', glow: '#60a5fa' },
  { x: 180, y: 110, w: 120, h: 40, label: 'RAG Engine',     color: '#0d1f17', text: '#34d399', glow: '#34d399' },
  { x: 20,  y: 210, w: 120, h: 40, label: 'GPT-4 / Claude', color: '#0d1525', text: '#60a5fa', glow: '#60a5fa' },
  { x: 180, y: 210, w: 120, h: 40, label: 'Uni Docs DB',    color: '#1a0d25', text: '#c084fc', glow: '#c084fc' },
  { x: 100, y: 300, w: 120, h: 40, label: 'AI Response',    color: '#0d1f17', text: '#34d399', glow: '#34d399' },
]

const ARCH_PATHS = [
  'M160,60 L80,110',
  'M160,60 L240,110',
  'M80,150 L80,210',
  'M240,150 L240,210',
  'M80,250 L160,300',
  'M240,250 L160,300',
]

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.4 + 0.1,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 5,
}))

/* ─── Responsive styles injected once ─── */
const RESPONSIVE_CSS = `
  .learnify-section {
    padding: 8rem 0;
  }

  /* ── Two-col layout ── */
  .learnify-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  /* ── Stats row ── */
  .learnify-stats {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  /* ── Header row (title + tags) ── */
  .learnify-title-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  /* ── Tablet: ~768px ── */
  @media (max-width: 900px) {
    .learnify-grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  /* ── Mobile: ~480px ── */
  @media (max-width: 560px) {
    .learnify-section {
      padding: 5rem 0;
    }

    .learnify-grid {
      gap: 2rem;
    }

    .learnify-stats {
      flex-wrap: wrap;
    }

    .learnify-stats > div {
      flex: 1 1 calc(33% - 0.5rem);
      min-width: 80px;
    }

    .learnify-title-row h2 {
      font-size: clamp(2rem, 8vw, 3rem) !important;
    }

    .learnify-title-row {
      gap: 0.5rem;
    }
  }

  /* ── Very small: ~360px ── */
  @media (max-width: 380px) {
    .learnify-stats > div {
      flex: 1 1 100%;
    }
  }
`

function injectStyles() {
  if (document.getElementById('learnify-responsive')) return
  const tag = document.createElement('style')
  tag.id = 'learnify-responsive'
  tag.textContent = RESPONSIVE_CSS
  document.head.appendChild(tag)
}

export default function Learnify() {
  const sectionRef   = useRef(null)
  const bgRef        = useRef(null)
  const titleRef     = useRef(null)
  const statsRef     = useRef([])
  const diagramRef   = useRef(null)
  const cardsRef     = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    injectStyles()

    const ctx = gsap.context(() => {

      /* 1. BG ORBS */
      gsap.to('.bg-orb-1', { scale: 1.3, opacity: 0.18, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.bg-orb-2', { scale: 1.2, opacity: 0.12, duration: 7, delay: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.bg-orb-3', { scale: 1.4, opacity: 0.10, duration: 6, delay: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })

      /* 2. PARTICLES */
      particlesRef.current.forEach((el) => {
        if (!el) return
        gsap.to(el, {
          y: -30, x: `+=${Math.random() * 20 - 10}`,
          opacity: 0, duration: parseFloat(el.dataset.dur),
          delay: parseFloat(el.dataset.delay),
          ease: 'power1.out', repeat: -1, repeatDelay: Math.random() * 2,
          onRepeat() { gsap.set(el, { y: 0, x: 0, opacity: parseFloat(el.dataset.opacity) }) }
        })
      })

      /* 3. GRID SCAN */
      gsap.to('.grid-scan', { y: '100%', duration: 3, ease: 'none', repeat: -1, delay: 1 })

      /* 4. TITLE */
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true } }
      )

      /* 5. STATS */
      statsRef.current.forEach((el, i) => {
        if (!el) return
        const obj = { v: 0 }
        gsap.fromTo(obj, { v: 0 }, {
          v: STATS[i].val, duration: 2.5, ease: 'power3.out',
          onUpdate() { if (el) el.textContent = Math.round(obj.v) },
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        })
      })

      /* 6. ARCH NODES */
      if (diagramRef.current) {
        const nodes      = diagramRef.current.querySelectorAll('.arch-node')
        const pulseRings = diagramRef.current.querySelectorAll('.pulse-ring')

        gsap.fromTo(nodes,
          { opacity: 0, scale: 0.5, transformOrigin: 'center center' },
          {
            opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: diagramRef.current, start: 'top 80%', once: true,
              onEnter: () => {
                const paths = diagramRef.current.querySelectorAll('.draw-line')
                paths.forEach((p, pi) => {
                  const len = p.getTotalLength ? p.getTotalLength() : 80
                  gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
                  gsap.to(p, { strokeDashoffset: 0, opacity: 1, duration: 0.7, ease: 'power2.inOut', delay: 0.9 + pi * 0.12 })
                })
                gsap.fromTo(pulseRings,
                  { scale: 0.8, opacity: 0.6 },
                  { scale: 1.6, opacity: 0, duration: 1.5, stagger: 0.2, ease: 'power2.out', delay: 1.8, repeat: -1, repeatDelay: 2 }
                )
              }
            }
          }
        )
        gsap.delayedCall(2.5, () => startDataFlow(diagramRef.current))
      }

      /* 7. CARDS */
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.feat-card')
        gsap.fromTo(cards,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', once: true } }
        )
      }

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  function startDataFlow(container) {
    const pathDefs = [
      { start: { x: 160, y: 60 },  end: { x: 80,  y: 110 } },
      { start: { x: 160, y: 60 },  end: { x: 240, y: 110 } },
      { start: { x: 80,  y: 150 }, end: { x: 80,  y: 210 } },
      { start: { x: 240, y: 150 }, end: { x: 240, y: 210 } },
      { start: { x: 80,  y: 250 }, end: { x: 160, y: 300 } },
      { start: { x: 240, y: 250 }, end: { x: 160, y: 300 } },
    ]
    const svg = container.querySelector('svg')
    if (!svg) return

    pathDefs.forEach((pd, i) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      dot.setAttribute('r', '3.5')
      dot.setAttribute('fill', i % 2 === 0 ? '#34d399' : '#60a5fa')
      dot.style.filter = `drop-shadow(0 0 4px ${i % 2 === 0 ? '#34d399' : '#60a5fa'})`
      svg.appendChild(dot)

      const animate = () => {
        gsap.set(dot, { attr: { cx: pd.start.x, cy: pd.start.y }, opacity: 1 })
        gsap.to(dot, {
          attr: { cx: pd.end.x, cy: pd.end.y },
          duration: 0.9, ease: 'power1.inOut', delay: i * 0.3,
          onComplete: () => {
            gsap.to(dot, { opacity: 0, duration: 0.15, onComplete: () => {
              gsap.delayedCall(1.5 + Math.random() * 1.5, animate)
            }})
          }
        })
      }
      gsap.delayedCall(i * 0.4, animate)
    })
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="learnify-section"
      style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}
    >
      {/* ══ ANIMATED BACKGROUND ══ */}
      <div ref={bgRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />
        <div className="grid-scan" style={{
          position: 'absolute', top: '-100%', left: 0, right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, transparent, rgba(52,211,153,0.025), transparent)',
          pointerEvents: 'none',
        }} />
        <div className="bg-orb-1" style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 70%)',
          opacity: 0.12,
        }} />
        <div className="bg-orb-2" style={{
          position: 'absolute', bottom: '-5%', right: '-10%',
          width: '45vw', height: '45vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.14) 0%, transparent 70%)',
          opacity: 0.09,
        }} />
        <div className="bg-orb-3" style={{
          position: 'absolute', top: '40%', right: '25%',
          width: '30vw', height: '30vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.10) 0%, transparent 70%)',
          opacity: 0.08,
        }} />
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            ref={el => particlesRef.current[p.id] = el}
            data-dur={p.duration}
            data-delay={p.delay}
            data-opacity={p.opacity}
            style={{
              position: 'absolute',
              left: `${p.x}%`, top: `${p.y}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              borderRadius: '50%',
              background: p.id % 3 === 0 ? '#34d399' : p.id % 3 === 1 ? '#60a5fa' : '#c084fc',
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2}px currentColor`,
            }}
          />
        ))}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 120, height: 120,
          borderTop: '1px solid rgba(52,211,153,0.15)',
          borderLeft: '1px solid rgba(52,211,153,0.15)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0, width: 120, height: 120,
          borderBottom: '1px solid rgba(52,211,153,0.15)',
          borderRight: '1px solid rgba(52,211,153,0.15)',
        }} />
      </div>

      {/* ══ CONTENT ══ */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-eyebrow">hero project</div>

        {/* Title */}
        <div ref={titleRef} style={{ opacity: 0, marginBottom: '3rem' }}>
          <div className="learnify-title-row">
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>Learnify</h2>
            <span className="tag">Education SaaS</span>
            <span className="tag" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', borderColor: 'rgba(251,191,36,0.25)' }}>★ Featured</span>
          </div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text2)', maxWidth: 600, lineHeight: 1.7 }}>
            University students lacked personalized AI learning tools tied to their actual course content.
            Learnify brings RAG, an AI tutor, and automated assignment assistance into one platform.
          </p>
        </div>

        {/* ── MAIN GRID (responsive via CSS class) ── */}
        <div className="learnify-grid">

          {/* LEFT — Architecture + Stats */}
          <div>
            <p style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 16, height: 1, background: 'var(--em)', display: 'inline-block' }} />
              architecture
            </p>

            <div
              ref={diagramRef}
              className="glass"
              style={{
                padding: '2rem', borderRadius: 16,
                background: 'rgba(10,18,14,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(52,211,153,0.12)',
                boxShadow: '0 0 40px rgba(52,211,153,0.05), inset 0 1px 0 rgba(52,211,153,0.08)',
              }}
            >
              {/* SVG fills container width via width="100%" + viewBox */}
              <svg viewBox="0 0 320 360" width="100%" style={{ overflow: 'visible', display: 'block' }}>
                <defs>
                  <filter id="glow-green">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glow-blue">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 Z" fill="rgba(52,211,153,0.6)" />
                  </marker>
                </defs>

                {ARCH_PATHS.map((d, i) => (
                  <path
                    key={i}
                    className="draw-line"
                    d={d}
                    fill="none"
                    stroke={i % 2 === 0 ? 'rgba(52,211,153,0.4)' : 'rgba(96,165,250,0.4)'}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    markerEnd="url(#arr)"
                    style={{ opacity: 0, filter: 'drop-shadow(0 0 3px currentColor)' }}
                  />
                ))}

                {ARCH_NODES.map((n, i) => (
                  <g key={i} className="arch-node" style={{ opacity: 0 }}>
                    <rect
                      className="pulse-ring"
                      x={n.x - 4} y={n.y - 4}
                      width={n.w + 8} height={n.h + 8}
                      rx="11" fill="none"
                      stroke={n.glow} strokeWidth="1" strokeOpacity="0.4"
                      style={{ transformOrigin: `${n.x + n.w/2}px ${n.y + n.h/2}px`, opacity: 0 }}
                    />
                    <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8"
                      fill={n.color} stroke={n.text} strokeWidth="1" strokeOpacity="0.5" />
                    <rect x={n.x + 1} y={n.y + 1} width={n.w - 2} height={4} rx="7"
                      fill={n.text} fillOpacity="0.07" />
                    <text
                      x={n.x + n.w/2} y={n.y + n.h/2 + 1}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={n.text} fontSize="11"
                      fontFamily="var(--font-mono)" fontWeight="600"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Stats — responsive via CSS class */}
            <div className="learnify-stats">
              {STATS.map((s, i) => (
                <div key={i} className="glass" style={{
                  flex: 1, padding: '1.2rem 1rem', textAlign: 'center', borderRadius: 12,
                  background: 'rgba(10,18,14,0.5)',
                  border: '1px solid rgba(52,211,153,0.1)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)',
                  }} />
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--em)', lineHeight: 1 }}>
                    <span ref={el => statsRef.current[i] = el}>0</span>{s.suffix}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: 6, letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Features + Tech + Video */}
          <div>
            <p style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 16, height: 1, background: 'var(--em)', display: 'inline-block' }} />
              features
            </p>

            <div ref={cardsRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="feat-card glass"
                  style={{
                    opacity: 0,
                    padding: '0.9rem 1.25rem', borderRadius: 12,
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'rgba(10,18,14,0.45)',
                    border: '1px solid rgba(52,211,153,0.09)',
                    transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                    cursor: 'default', position: 'relative', overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'
                    e.currentTarget.style.transform = 'translateX(6px)'
                    e.currentTarget.style.boxShadow = '-4px 0 20px rgba(52,211,153,0.08), inset 0 0 20px rgba(52,211,153,0.03)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(52,211,153,0.09)'
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 2,
                    background: 'linear-gradient(to bottom, transparent, var(--em), transparent)',
                    opacity: 0.6, borderRadius: 2,
                  }} />
                  <span style={{ fontSize: '1.1rem', flexShrink: 0, marginLeft: 8 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 16, height: 1, background: 'var(--em)', display: 'inline-block' }} />
              tech stack
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '2rem' }}>
              {TECH.map(t => (
                <span key={t} className="tag" style={{
                  fontSize: '11px', transition: 'all 0.2s', cursor: 'default',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(52,211,153,0.12)'
                    e.currentTarget.style.borderColor = 'rgba(52,211,153,0.35)'
                    e.currentTarget.style.color = '#34d399'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = ''
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.color = ''
                  }}
                >{t}</span>
              ))}
            </div>

            <p style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 16, height: 1, background: 'var(--em)', display: 'inline-block' }} />
              demo
            </p>
            <div style={{
              borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(52,211,153,0.15)',
              background: '#000',
              boxShadow: '0 0 30px rgba(52,211,153,0.06)',
            }}>
              <video
                src="/learnify.mp4"
                controls
                playsInline
                style={{ width: '100%', display: 'block', maxHeight: 260, objectFit: 'cover' }}
              />
              <div style={{
                padding: '8px 14px', background: 'rgba(10,18,14,0.7)',
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)',
                borderTop: '1px solid rgba(52,211,153,0.08)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--em)', display: 'inline-block', boxShadow: '0 0 6px var(--em)' }} />
                learnify — demo walkthrough
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
