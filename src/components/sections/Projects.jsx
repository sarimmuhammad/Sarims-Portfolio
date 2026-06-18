import { useEffect, useRef, useState } from 'react'
import { gsap, revealOnScroll } from '../../lib/animations'

const PROJECTS = [
  {
    id: 'autoshorts',
    name: 'AutoShorts AI',
    category: 'Video AI Pipeline',
    color: '#f43f5e',
    colorDim: 'rgba(244,63,94,0.1)',
    videoFile: 'https://youtube.com/embed/1jGVX_CO_8Q?si=ADyaW4iBITc4hEQT&rel=0',
    desc: 'Open-source, fully self-hosted pipeline that transforms long-form videos into viral 9:16 short clips. Runs 100% locally — no cloud APIs, no subscriptions, full data privacy.',
    problem: 'Creators needed an automated way to turn long videos into high-retention shorts without paying recurring SaaS fees or sending footage to third-party clouds.',
    tech: ['Whisper', 'KeyBERT', 'VADER', 'FFmpeg', 'Python', 'Streamlit'],
    metrics: ['100% local', 'Auto captions', 'Auto PDF reports'],
  },
  {
    id: 'velour',
    name: 'Velour Chatbot',
    category: 'Brand AI',
    color: '#c084fc',
    colorDim: 'rgba(192,132,252,0.1)',
    videoFile: 'https://youtube.com/embed/AujQQSorcEo?si=ihW2JE3vdw-kTnSv&rel=0',
    desc: 'Multi-LLM conversational chatbot embedded in the Velour brand. Switches between GPT-4, Claude, and Gemini based on query complexity.',
    problem: 'Brand needed 24/7 intelligent customer interaction without a support team.',
    tech: ['GPT-4', 'Claude', 'Gemini', 'React', 'WebSocket'],
    metrics: ['3 LLMs', '24/7 uptime', '80% deflection'],
  },
  {
    id: 'zaiqa',
    name: 'Zaiqa DM Automation',
    category: 'Instagram AI',
    color: '#f97316',
    colorDim: 'rgba(249,115,22,0.1)',
    videoFile: 'https://youtube.com/embed/LccdhoEv2nQ?si=4A0pD1_zOTnvh_CJ&rel=0',
    desc: 'Full Instagram DM automation pipeline for food brand Zaiqa. Detects order intents, collects details, and confirms orders — fully automated.',
    problem: 'Manual DM replies were costing 3+ hours/day and missing sales opportunities.',
    tech: ['Python', 'Meta Graph API', 'GPT-4', 'n8n', 'PostgreSQL'],
    metrics: ['3hrs saved/day', '40% more orders', '0 missed DMs'],
  },
  {
    id: 'roomstyling',
    name: 'AI Room Styling',
    category: 'Computer Vision',
    color: '#60a5fa',
    colorDim: 'rgba(96,165,250,0.1)',
    videoFile: 'https://youtube.com/embed/5JSpIxP9Xus?si=U5r5iSUQbiKRaJOg&rel=0',
    desc: 'Upload a photo of any room and receive multiple AI-generated styled versions. Custom pipeline from detection to generation to output.',
    problem: 'Interior designers and homeowners needed instant visual inspiration without hiring designers.',
    tech: ['Custom CV Pipeline', 'Python', 'DALL-E 3', 'FastAPI', 'React'],
    metrics: ['< 8s per style', '5 style variants', 'Custom pipeline'],
  },
  {
    id: 'voiceagent',
    name: 'Custom TTS Voice Agent',
    category: 'Voice AI',
    color: '#34d399',
    colorDim: 'rgba(52,211,153,0.1)',
    videoFile: '/voiceagent.mp4',
    desc: 'A fully custom voice agent built from scratch — no ElevenLabs. Handles inbound calls, qualifies leads, and routes to humans when needed.',
    problem: 'Businesses needed human-like phone agents without subscription costs scaling with usage.',
    tech: ['Custom TTS Model', 'Python', 'Twilio', 'WebRTC', 'FastAPI'],
    metrics: ['< 300ms latency', 'Custom voice', '3 scenarios'],
  },
]

/* ── Responsive CSS ── */
const PROJECTS_CSS = `
  .projects-section {
    padding: 8rem 0;
  }

  /* Horizontal scroll strip */
  .h-scroll {
    display: flex;
    gap: 1.25rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 1rem;
  }
  .h-scroll::-webkit-scrollbar { display: none; }

  /* Project card — snap each card */
  .project-card {
    scroll-snap-align: start;
    width: min(85vw, 480px);
    flex-shrink: 0;
  }

  @media (max-width: 560px) {
    .projects-section {
      padding: 5rem 0;
    }
    .project-card {
      width: min(90vw, 400px);
    }
    .h-scroll {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`

function injectStyles(id, css) {
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id
  tag.textContent = css
  document.head.appendChild(tag)
}

function VideoPlayer({ src, color }) {
  return (
    <div style={{
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${color}30`,
      background: '#000',
      marginTop: '1rem',
    }}>

      {/* FIXED YOUTUBE BOX */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
      }}>
        <iframe
          src={src}
          title="Project Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>

      {/* bottom label */}
      <div style={{
        padding: '7px 12px',
        background: 'var(--bg2)',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        fontSize: '11px',
        color: 'var(--text3)',
        fontFamily: 'var(--font-mono)'
      }}>
        <span style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: color,
        }} />
        demo walkthrough
      </div>

    </div>
  )
}

function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="project-card glass" style={{
      borderRadius: 20,
      padding: '2rem',
      transition: 'all 0.3s',
      border: `1px solid ${expanded ? project.color + '40' : 'var(--border)'}`,
      background: expanded ? project.colorDim : 'var(--surface)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <span style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: 100,
            fontSize: '10px', fontFamily: 'var(--font-mono)',
            background: project.colorDim, color: project.color,
            border: `1px solid ${project.color}30`, marginBottom: '0.75rem'
          }}>
            {project.category}
          </span>
          <h3 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            {project.name}
          </h3>
        </div>
        <span style={{
          padding: '4px 10px', borderRadius: 100, fontSize: '10px',
          background: project.colorDim, color: project.color,
          border: `1px solid ${project.color}20`, flexShrink: 0
        }}>
          demo ✓
        </span>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        {project.desc}
      </p>

      {/* Metrics */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {project.metrics.map(m => (
          <div key={m} style={{
            padding: '5px 12px', borderRadius: 8,
            background: project.colorDim, color: project.color,
            fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)'
          }}>{m}</div>
        ))}
      </div>

      {/* Tech */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {project.tech.map(t => <span key={t} className="tag" style={{ fontSize: '10px' }}>{t}</span>)}
      </div>

      {/* Expand toggle */}
      <button onClick={() => setExpanded(!expanded)} style={{
        width: '100%', padding: '10px', borderRadius: 10,
        border: `1px solid ${project.color}40`,
        background: expanded ? project.color + '20' : 'transparent',
        color: project.color, fontSize: '13px', fontWeight: 600,
        transition: 'all 0.2s', cursor: 'pointer',
      }}>
        {expanded ? '↑ Hide demo' : '↓ View demo + case study'}
      </button>

      {/* Expanded */}
      {expanded && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${project.color}20` }}>
          <div style={{
            fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem'
          }}>
            the problem
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1rem' }}>
            {project.problem}
          </p>
          <VideoPlayer src={project.videoFile} color={project.color} />
        </div>
      )}
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const scrollRef  = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    injectStyles('projects-responsive', PROJECTS_CSS)
    const ctx = gsap.context(() => {
      revealOnScroll(titleRef.current, { start: 'top 80%' })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const scrollTo = (i) => {
    if (!scrollRef.current) return
    const cards = scrollRef.current.children
    if (!cards[i]) return
    scrollRef.current.scrollTo({ left: cards[i].offsetLeft - 16, behavior: 'smooth' })
    setActiveIdx(i)
  }

  return (
    <section ref={sectionRef} className="projects-section" style={{ background: 'var(--bg2)' }}>
      <div className="container" style={{ marginBottom: '3rem' }}>
        <div className="section-eyebrow">projects</div>
        <div ref={titleRef} style={{ opacity: 0 }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>More AI products</h2>
          <p style={{ color: 'var(--text2)', maxWidth: 500, lineHeight: 1.7 }}>
            From Instagram automation to custom voice agents — each product solves a real business problem.
          </p>
        </div>

        {/* Dot nav */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          {PROJECTS.map((_, i) => (
            <button key={i} onClick={() => scrollTo(i)} style={{
              width: activeIdx === i ? 24 : 8, height: 8,
              borderRadius: 100, border: 'none', padding: 0,
              background: activeIdx === i ? 'var(--em)' : 'var(--text3)',
              transition: 'all 0.3s', cursor: 'pointer',
            }} />
          ))}
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="h-scroll"
        style={{ paddingLeft: 'max(1rem, calc((100vw - 1200px) / 2))', paddingRight: '2rem' }}
        onScroll={e => {
          const cards = Array.from(e.currentTarget.children)
          let closest = 0, minDist = Infinity
          cards.forEach((c, i) => {
            const dist = Math.abs(c.offsetLeft - e.currentTarget.scrollLeft - 16)
            if (dist < minDist) { minDist = dist; closest = i }
          })
          setActiveIdx(closest)
        }}
      >
        {PROJECTS.map(p => <ProjectCard key={p.id} project={p} />)}
        <div style={{ width: '2rem', flexShrink: 0 }} />
      </div>
    </section>
  )
}