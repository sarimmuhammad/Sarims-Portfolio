import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'

// ─── HOOK: window size ────────────────────────────────────────────────────────
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return size
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const ROLES = [
  'AI Engineer',
  'AI Automation Expert',
  'AI Product Builder',
  'Full Stack AI Builder',
  'AI Consultant',
  'AI SaaS Developer',
]

const STATS = [
  { num: '50+', label: 'AI Workflows' },
  { num: '15+', label: 'AI Pipelines' },
  { num: '3+',  label: 'Years Building' },
]

// ─── PARTICLES ───────────────────────────────────────────────────────────────
function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    let W, H, raf
    const resize = () => {
      W = c.width  = c.offsetWidth
      H = c.height = c.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const pts = Array.from({ length: 42 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      r:  Math.random() * 1.1 + 0.3,
    }))
    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x = (p.x + p.vx + W) % W
        p.y = (p.y + p.vy + H) % H
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(52,211,153,0.42)'
        ctx.fill()
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}

// ─── ROLE SWITCHER ────────────────────────────────────────────────────────────
function RoleSwitcher() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ROLES.length), 2800)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ height: 28, overflow: 'hidden', position: 'relative', marginBottom: 24 }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 20, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0,  opacity: 1, filter: 'blur(0px)',
            transition: { type: 'spring', stiffness: 280, damping: 26 } }}
          exit={{ y: -20, opacity: 0, filter: 'blur(6px)',
            transition: { duration: 0.2 } }}
          style={{
            position: 'absolute',
            fontFamily: '"Courier New", monospace',
            color: '#34d399',
            letterSpacing: '0.04em',
            fontSize: 'clamp(0.82rem, 1.4vw, 1.08rem)',
            whiteSpace: 'nowrap',
          }}
        >
          {ROLES[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
function MagBtn({ children, primary, onClick }) {
  const x  = useMotionValue(0)
  const y  = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 20 })
  const sy = useSpring(y, { stiffness: 160, damping: 20 })
  const ref = useRef(null)

  return (
    <motion.button
      ref={ref}
      onMouseMove={e => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width  / 2) * 0.28)
        y.set((e.clientY - r.top  - r.height / 2) * 0.28)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      onClick={onClick}
      style={{
        x: sx, y: sy,
        padding: '12px 24px',
        borderRadius: 12,
        border: primary ? 'none' : '1px solid rgba(52,211,153,0.25)',
        background: primary
          ? 'linear-gradient(135deg,#34d399 0%,#10b981 55%,#059669 100%)'
          : 'rgba(255,255,255,0.025)',
        backdropFilter: primary ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: primary ? 'none' : 'blur(12px)',
        color: primary ? '#021a0a' : '#34d399',
        fontSize: 'clamp(0.68rem, 1.2vw, 0.78rem)',
        fontWeight: 800,
        fontFamily: 'inherit',
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: primary ? '0 0 30px rgba(52,211,153,0.38)' : 'none',
        transition: 'box-shadow 0.25s',
        whiteSpace: 'nowrap',
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: primary
          ? '0 0 55px rgba(52,211,153,0.65)'
          : '0 0 24px rgba(52,211,153,0.16)',
      }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}

// ─── FLOAT CARD ───────────────────────────────────────────────────────────────
// isMobile prop: on mobile these render inline below portrait, not absolute
function FloatCard({ icon, title, sub, style, delay, isMobile }) {
  const base = {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: 'rgba(4,12,8,0.78)',
    border: '1px solid rgba(52,211,153,0.2)',
    borderRadius: 14,
    padding: '12px 16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(52,211,153,0.09)',
    cursor: 'default',
  }

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        style={{ ...base, flex: 1, minWidth: 140 }}
      >
        <div style={{ fontSize: '1rem', marginBottom: 5 }}>{icon}</div>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 3 }}>
          {title}
        </div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(52,211,153,0.78)', fontFamily: '"Courier New", monospace' }}>
          {sub}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: [0, -9, 0], scale: 1 }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale:   { delay, duration: 0.5, type: 'spring', stiffness: 220 },
        y:       { delay: delay + 0.4, duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.06, boxShadow: '0 16px 48px rgba(52,211,153,0.22)', transition: { duration: 0.22 } }}
      style={{ ...base, ...style, position: 'absolute', minWidth: 160, zIndex: 20 }}
    >
      <div style={{ fontSize: '1.1rem', marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#fff', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 3 }}>
        {title}
      </div>
      <div style={{ fontSize: '0.62rem', color: 'rgba(52,211,153,0.78)', fontFamily: '"Courier New", monospace' }}>
        {sub}
      </div>
    </motion.div>
  )
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
export default function Hero() {
  const { w } = useWindowSize()
  // breakpoints
  const isMobile = w < 640
  const isTablet = w >= 640 && w < 1024

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const smX = useSpring(mouseX, { stiffness: 45, damping: 22 })
  const smY = useSpring(mouseY, { stiffness: 45, damping: 22 })

  const rotY  = useTransform(smX, [0, 1], [-5,  5])
  const rotX  = useTransform(smY, [0, 1], [ 4, -4])
  const glowL = useTransform(smX, [0, 1], ['15%', '85%'])
  const glowT  = useTransform(smY, [0, 1], ['15%', '85%'])

  const scrollY = useMotionValue(0)
  const photoY  = useTransform(scrollY, [0, 500], [0,  isMobile ? 0 : 48])
  const textY   = useTransform(scrollY, [0, 500], [0, isMobile ? 0 : -20])

  useEffect(() => {
    const onM = e => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    const onS = () => scrollY.set(window.scrollY)
    window.addEventListener('mousemove', onM)
    window.addEventListener('scroll', onS, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onM)
      window.removeEventListener('scroll', onS)
    }
  }, [])

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    show:   { opacity: 1, y: 0,  filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 190, damping: 22 } },
  }

  // ── Layout decisions based on breakpoint ──
  const isDesktop = !isMobile && !isTablet

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: isMobile ? 'column' : isTablet ? 'column' : 'row',
        background: '#050e08',
      }}
    >
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 100%)',
      }} />

      {/* Gradient mesh */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 55% 60% at 75% 38%, rgba(52,211,153,0.07) 0%, transparent 65%),
          radial-gradient(ellipse 35% 35% at 18% 75%, rgba(16,185,129,0.04) 0%, transparent 55%)
        `,
      }} />

      {/* Noise grain */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.025, pointerEvents:'none', zIndex:0 }}>
        <filter id="gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#gr)"/>
      </svg>

      <Particles />

      {/* Cursor glow */}
      <motion.div style={{
        position: 'absolute', width: 620, height: 620, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)',
        transform: 'translate(-50%,-50%)',
        left: glowL, top: glowT,
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── MOBILE / TABLET: Portrait comes FIRST (top) ── */}
      {!isDesktop && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: isMobile ? '5rem' : '4rem',
            paddingBottom: '1.5rem',
          }}
        >
          {/* Portrait wrapper */}
          <div style={{
            position: 'relative',
            width: isMobile ? '62%' : '40%',
            maxWidth: isMobile ? 240 : 320,
            aspectRatio: '3 / 4',
          }}>
            {/* Glow ring */}
            <motion.div
              style={{
                position: 'absolute', inset: -10, borderRadius: 28,
                border: '1px solid rgba(52,211,153,0.14)', zIndex: 0,
              }}
              animate={{ boxShadow: [
                '0 0 40px rgba(52,211,153,0.08)',
                '0 0 80px rgba(52,211,153,0.22)',
                '0 0 40px rgba(52,211,153,0.08)',
              ]}}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <img
              src="/saaram.jpg"
              alt="Muhammad Saaram"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                borderRadius: 20, display: 'block', zIndex: 1,
              }}
            />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: 'linear-gradient(to bottom, #050e08 0%, transparent 16%)',
              zIndex: 2, pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: 'linear-gradient(to top, #050e08 0%, transparent 22%)',
              zIndex: 2, pointerEvents: 'none',
            }} />
          </div>

          {/* Float cards inline on mobile */}
          <div style={{
            display: 'flex', gap: 10, marginTop: 16,
            width: isMobile ? '88%' : '60%',
            maxWidth: 400,
            justifyContent: 'center',
          }}>
            <FloatCard icon="" title="AI Automations" sub="50+ Workflows Built"   delay={0.9} isMobile />
            <FloatCard icon="" title="AI Agents" sub="Production Ready Agents" delay={1.1} isMobile />
          </div>
        </motion.div>
      )}

      {/* ── TEXT COLUMN ─────────────────────────────────────────────────────── */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          justifyContent: isDesktop ? 'center' : 'flex-start',
          // Desktop: left half. Mobile/tablet: full width
          flex: isDesktop ? '0 0 50%' : '1 1 auto',
          padding: isMobile
            ? '0 1.5rem 3rem'
            : isTablet
              ? '1rem 3rem 4rem'
              : 'clamp(5rem,8vw,8rem) clamp(2rem,4vw,4.5rem) 4rem clamp(2rem,5vw,5rem)',
          y: textY,
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        {/* Badge */}
        <motion.div variants={fadeUp} style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22,
          justifyContent: isMobile ? 'center' : 'flex-start',
        }}>
          <motion.span
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', flexShrink: 0, display: 'block' }}
            animate={{ boxShadow: ['0 0 5px #34d399','0 0 16px #34d399, 0 0 28px rgba(52,211,153,0.35)','0 0 5px #34d399'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span style={{
            fontSize: 'clamp(0.55rem, 1.1vw, 0.63rem)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#34d399', fontFamily: '"Courier New", monospace',
          }}>
            Turning Ideas into Scalable AI Systems
          </span>
        </motion.div>

        {/* Name */}
        <motion.div variants={fadeUp} style={{ marginBottom: 12 }}>
          <div style={{
            fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.04em',
            fontSize: isMobile ? 'clamp(2.8rem, 14vw, 3.5rem)' : isTablet ? 'clamp(3rem, 8vw, 4.5rem)' : 'clamp(3rem, 6vw, 6rem)',
          }}>
            <span style={{
              display: 'block', color: 'rgba(255,255,255,0.3)',
              fontSize: '0.47em', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.1em',
            }}>
              Muhammad
            </span>
            <motion.span
              style={{
                display: 'block',
                background: 'linear-gradient(105deg, #ffffff 0%, #a7f3d0 28%, #34d399 55%, #fff 82%)',
                backgroundSize: '240% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{ backgroundPosition: ['0% center', '240% center'] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
            >
              Saaram
            </motion.span>
          </div>
        </motion.div>

        {/* Role */}
        <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <RoleSwitcher />
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          style={{
            width: 44, height: 2,
            background: 'linear-gradient(90deg,#34d399,transparent)',
            borderRadius: 2, marginBottom: 20,
            marginLeft: isMobile ? 'auto' : 0,
            marginRight: isMobile ? 'auto' : 0,
          }}
        />

        {/* Description */}
        <motion.p variants={fadeUp} style={{
          fontSize: 'clamp(0.82rem, 1.1vw, 0.96rem)',
          lineHeight: 1.8, color: 'rgba(255,255,255,0.42)',
          letterSpacing: '0.01em',
          maxWidth: isMobile ? '100%' : 400,
          margin: '0 0 28px 0',
        }}>
          Crafting intelligent products, AI-powered automations, and scalable
          digital experiences that solve real-world problems.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'flex-start',
          marginBottom: 36,
        }}>
          <MagBtn primary onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Let's Build Something
          </MagBtn>
          <MagBtn onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}>
            View Projects
          </MagBtn>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} style={{
          display: 'flex', gap: isMobile ? 20 : 32, flexWrap: 'wrap',
          borderTop: '1px solid rgba(52,211,153,0.1)',
          paddingTop: 24,
          justifyContent: isMobile ? 'center' : 'flex-start',
        }}>
          {STATS.map(({ num, label }) => (
            <motion.div key={label} whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400 } }}>
              <div style={{
                fontSize: isMobile ? '1.3rem' : 'clamp(1.3rem, 1.7vw, 1.55rem)',
                fontWeight: 900, color: '#34d399', letterSpacing: '-0.03em', lineHeight: 1,
              }}>
                {num}
              </div>
              <div style={{
                fontSize: '0.56rem', color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 5,
              }}>
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── DESKTOP: Portrait RIGHT COLUMN ─────────────────────────────────── */}
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            flex: '0 0 50%',
            y: photoY,
            rotateY: rotY,
            rotateX: rotX,
            transformStyle: 'preserve-3d',
            perspective: 1200,
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <div style={{
            position: 'relative',
            width: '76%',
            maxWidth: 430,
            aspectRatio: '3 / 4',
          }}>
            {/* Glow ring */}
            <motion.div
              style={{
                position: 'absolute', inset: -12, borderRadius: 36,
                border: '1px solid rgba(52,211,153,0.14)', zIndex: 0,
              }}
              animate={{ boxShadow: [
                '0 0 40px rgba(52,211,153,0.08)',
                '0 0 80px rgba(52,211,153,0.22), 0 0 120px rgba(52,211,153,0.05)',
                '0 0 40px rgba(52,211,153,0.08)',
              ]}}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            <img
              src="/saaram.jpg"
              alt="Muhammad Saaram"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                borderRadius: 24, display: 'block', zIndex: 1,
              }}
            />

            {/* Top/bottom edge fades */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 24,
              background: 'linear-gradient(to bottom, #050e08 0%, transparent 16%)',
              zIndex: 2, pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 24,
              background: 'linear-gradient(to top, #050e08 0%, transparent 22%)',
              zIndex: 2, pointerEvents: 'none',
            }} />

            {/* Float cards — desktop absolute positioned */}
            <FloatCard
              icon="" title="AI Automations" sub="50+ Workflows Built"
              delay={1.1} style={{ bottom: -16, left: -44 }}
            />
            <FloatCard
              icon="" title="AI Agents" sub="Production Ready Agents"
              delay={1.3} style={{ bottom: -44, right: -36 }}
            />
          </div>
        </motion.div>
      )}

      {/* ── SCROLL INDICATOR ── */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          style={{
            position: 'absolute',
            bottom: 28,
            left: isDesktop ? '25%' : '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
        >
          <motion.span
            style={{ fontSize: '0.52rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            Scroll
          </motion.span>
          <div style={{ width: 1, height: 44, overflow: 'hidden' }}>
            <motion.div
              style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(52,211,153,0.75), transparent)' }}
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* Corner brackets */}
      {[
        { s: { top: 0, left: 0 },     r: 0   },
        { s: { top: 0, right: 0 },    r: 90  },
        { s: { bottom: 0, left: 0 },  r: 270 },
        { s: { bottom: 0, right: 0 }, r: 180 },
      ].map(({ s, r }, i) => (
        <div key={i} style={{ position: 'absolute', ...s, width: 52, height: 52, pointerEvents: 'none', zIndex: 2 }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ transform: `rotate(${r}deg)` }}>
            <path d="M2 2 H24 M2 2 V24" stroke="rgba(52,211,153,0.13)" strokeWidth="1.5"/>
            <circle cx="2" cy="2" r="2" fill="rgba(52,211,153,0.25)"/>
          </svg>
        </div>
      ))}
    </section>
  )
}
