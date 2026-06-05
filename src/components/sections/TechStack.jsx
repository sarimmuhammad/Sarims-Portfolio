import { useEffect, useRef } from 'react'
import { gsap, staggerCards } from '../../lib/animations'

const STACK = [
  {
    category: 'LLMs',
    color: '#34d399',
    items: [
      { name: 'Groq',    icon: '', used: ['Learnify', 'Velour', 'Zaiqa'] },
      { name: 'Claude 3.5',icon: '', used: ['Learnify', 'Velour'] },
      { name: 'Gemini',    icon: '', used: ['Learnify'] },
      { name: 'Llama 3',   icon: '', used: ['Custom pipelines'] },
    ]
  },
  {
    category: 'Voice & Audio',
    color: '#af2626',
    items: [
      { name: 'Custom TTS', icon: '', used: ['Voice Agent'] },
      { name: 'Twilio',     icon: '', used: ['Voice Agent'] },
      { name: 'WebRTC',     icon: '', used: ['Voice Agent'] },
    ]
  },
  {
    category: 'Automation',
    color: '#82b8f9',
    items: [
      { name: 'n8n',        icon: '', used: ['Zaiqa', 'Velour'] },
      { name: 'Python',     icon: '', used: ['All projects'] },
      { name: 'FastAPI',    icon: '', used: ['Learnify', 'Room Styling'] },
      { name: 'Meta API',   icon: '', used: ['Zaiqa'] },
    ]
  },
  {
    category: 'AI Infra',
    color: '#c084fc',
    items: [
      { name: 'LangChain',  icon: '', used: ['Learnify'] },
      { name: 'Chromadb',   icon: '', used: ['Learnify'] },
      { name: 'RAG',        icon: '', used: ['Learnify', 'Velour'] },
      { name: 'OpenAI API', icon: '', used: ['All projects'] },
    ]
  },
  {
    category: 'Frontend',
    color: '#fbbf24',
    items: [
      { name: 'React',      icon: '', used: ['All products'] },
      { name: 'Tailwaind CSS',    icon: '',  used: ['Learnify'] },
      { name: 'Vite',       icon: '', used: ['Demos'] },
      { name: 'Framer Motion',       icon: '', used: ['Animations'] },
    ]
  },
]

export default function TechStack() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const gridRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 80%', once: true }
        }
      )
      if (gridRef.current) staggerCards(gridRef.current, '.stack-card')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ padding: '8rem 0', background: 'var(--bg)' }}>
      <div className="container">
        <div className="section-eyebrow">tech stack</div>

        <div ref={titleRef} style={{ opacity: 0, marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
            Tools of the trade
          </h2>
          <p style={{ color: 'var(--text2)', maxWidth: 500, lineHeight: 1.7 }}>
            Not a logo wall. Hover any card to see exactly which project it was used in.
          </p>
        </div>

        <div ref={gridRef} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {STACK.map(group => (
            <div key={group.category} className="stack-card">
              <div style={{
                fontSize: '11px', fontFamily: 'var(--font-mono)',
                color: group.color, textTransform: 'uppercase',
                letterSpacing: '0.1em', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <span style={{ width: 20, height: 1, background: group.color, display: 'inline-block' }} />
                {group.category}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {group.items.map(item => (
                  <div key={item.name}
                    className="glass"
                    style={{
                      padding: '12px 18px', borderRadius: 12,
                      cursor: 'default', transition: 'all 0.2s',
                      position: 'relative', overflow: 'hidden',
                      minWidth: 130
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = group.color + '60'
                      e.currentTarget.style.background = group.color + '0d'
                      e.currentTarget.style.transform = 'translateY(-3px)'
                      e.currentTarget.querySelector('.used-in').style.opacity = '1'
                      e.currentTarget.querySelector('.used-in').style.transform = 'translateY(0)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.background = 'var(--surface)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.querySelector('.used-in').style.opacity = '0'
                      e.currentTarget.querySelector('.used-in').style.transform = 'translateY(4px)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>
                    </div>
                    {/* Hover reveal */}
                    <div className="used-in" style={{
                      fontSize: '10px', fontFamily: 'var(--font-mono)',
                      color: group.color, opacity: 0,
                      transform: 'translateY(4px)',
                      transition: 'all 0.2s'
                    }}>
                      {item.used.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
