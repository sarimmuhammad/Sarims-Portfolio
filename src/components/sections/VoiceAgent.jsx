import { useEffect, useRef, useState } from 'react'
import { gsap, revealOnScroll } from '../../lib/animations'

const SCENARIOS = [
  {
    id: 'support',
    label: 'Customer Support',
    color: '#34d399',
    turns: [
      { role: 'user',  text: 'Hi, I placed an order last week and haven\'t received a tracking number.' },
      { role: 'agent', text: 'Hi there! I\'d be happy to help with that. Could you please share your order number or the email address used to place the order?' },
      { role: 'user',  text: 'Sure, it\'s order #4821, email is user@example.com' },
      { role: 'agent', text: 'Thank you! I\'ve located your order. It was dispatched on Monday and you should receive your tracking number via email within the next 2 hours. Is there anything else I can help you with?' },
      { role: 'user',  text: 'No that\'s perfect, thank you!' },
      { role: 'agent', text: 'You\'re welcome! Have a great day. Don\'t hesitate to reach out if you need anything else.' },
    ]
  },
  {
    id: 'lead',
    label: 'Lead Qualification',
    color: '#c084fc',
    turns: [
      { role: 'agent', text: 'Hi! Thanks for reaching out. I\'m Aria, the AI assistant. Are you interested in our enterprise or small business plan?' },
      { role: 'user',  text: 'We\'re a team of about 25 people, we need automation tools.' },
      { role: 'agent', text: 'Perfect! With 25 people you\'d benefit most from our Business plan. What processes are you currently looking to automate — HR, sales, or operations?' },
      { role: 'user',  text: 'Mainly sales follow-ups and lead tracking.' },
      { role: 'agent', text: 'Excellent! Our CRM automation suite would be a perfect fit. I\'ll connect you with a specialist who can give you a personalized demo. What\'s the best time this week?' },
    ]
  },
  {
    id: 'booking',
    label: 'Appointment Booking',
    color: '#f97316',
    turns: [
      { role: 'user',  text: 'I\'d like to book an appointment with Dr. Ahmed.' },
      { role: 'agent', text: 'Of course! Dr. Ahmed has availability this Thursday at 2 PM or Friday at 10 AM. Which works better for you?' },
      { role: 'user',  text: 'Thursday at 2 PM works great.' },
      { role: 'agent', text: 'Perfect! I\'ve booked you for Thursday at 2:00 PM with Dr. Ahmed. You\'ll receive a confirmation SMS and email shortly. Is there anything specific you\'d like to discuss during the appointment?' },
      { role: 'user',  text: 'Just a routine checkup.' },
      { role: 'agent', text: 'Got it! Your appointment is confirmed. Please arrive 10 minutes early to complete any paperwork. See you Thursday!' },
    ]
  },
]

const WAVE_DELAYS = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 0.6, 0.45, 0.3, 0.15, 0]
const WAVE_ANIMS = ['wave1','wave2','wave3','wave2','wave3','wave2','wave3','wave2','wave1','wave2','wave3','wave1']

export default function VoiceAgent() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const chatRef    = useRef(null)

  const [active, setActive]           = useState(0)
  const [playing, setPlaying]         = useState(false)
  const [currentTurn, setCurrentTurn] = useState(0)
  const [visibleTurns, setVisibleTurns] = useState([])

  const scenario = SCENARIOS[active]

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(titleRef.current, { start: 'top 80%' })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [visibleTurns])

  useEffect(() => {
    if (!playing) return
    if (currentTurn >= scenario.turns.length) {
      setPlaying(false)
      return
    }
    const delay = scenario.turns[currentTurn].role === 'agent' ? 1200 : 800
    const id = setTimeout(() => {
      setVisibleTurns(prev => [...prev, scenario.turns[currentTurn]])
      setCurrentTurn(t => t + 1)
    }, delay)
    return () => clearTimeout(id)
  }, [playing, currentTurn, scenario])

  const handlePlay = () => {
    setVisibleTurns([])
    setCurrentTurn(0)
    setPlaying(true)
  }

  const handleScenarioChange = (i) => {
    setActive(i)
    setPlaying(false)
    setVisibleTurns([])
    setCurrentTurn(0)
  }

  return (
    <section id="voice" ref={sectionRef} style={{ padding: '8rem 0', background: 'var(--bg2)' }}>
      <div className="container">
        <div className="section-eyebrow">voice ai</div>

        <div ref={titleRef} style={{ opacity: 0, marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
            Custom TTS voice agent
          </h2>
          <p style={{ color: 'var(--text2)', maxWidth: 540, lineHeight: 1.7 }}>
            Built from scratch — no ElevenLabs, no off-the-shelf TTS.
            A custom voice model with sub-300ms latency that handles real phone calls.
          </p>
          <div className="tag" style={{ marginTop: '1rem' }}>
            built from scratch — custom model
          </div>
        </div>

        <div className="voice-grid">

          {/* Phone UI */}
          <div className="phone-col">
            <div style={{
              width: 280,
              border: '1px solid var(--border2)',
              borderRadius: 32,
              overflow: 'hidden',
              background: 'var(--bg)',
              boxShadow: `0 0 60px ${scenario.color}20`
            }}>
              {/* Status bar */}
              <div style={{
                padding: '12px 20px 8px',
                background: 'var(--bg2)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text3)' }}>9:41</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text3)' }}>●●●</span>
              </div>

              {/* Call header */}
              <div style={{
                padding: '1.5rem 1rem 1rem',
                textAlign: 'center',
                borderBottom: '1px solid var(--border)'
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: scenario.color + '20',
                  border: `2px solid ${scenario.color}`,
                  margin: '0 auto 0.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                  position: 'relative'
                }}>
                  🤖
                  {playing && (
                    <div style={{
                      position: 'absolute', inset: -6,
                      borderRadius: '50%',
                      border: `2px solid ${scenario.color}`,
                      animation: 'pulse-ring 1.5s ease-out infinite',
                      opacity: 0.6
                    }} />
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Aria</div>
                <div style={{ fontSize: '11px', color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
                  {playing ? 'speaking...' : currentTurn > 0 ? 'call ended' : 'ready'}
                </div>
                <div style={{ fontSize: '10px', color: scenario.color, fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                  {playing ? '● LIVE' : currentTurn > 0 ? '◼ 0:' + String(currentTurn * 2).padStart(2,'0') : '● 0:00'}
                </div>
              </div>

              {/* Waveform */}
              <div style={{
                padding: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                height: 64
              }}>
                {WAVE_DELAYS.map((d, i) => (
                  <div key={i} style={{
                    width: 3, borderRadius: 100,
                    background: scenario.color,
                    height: playing ? undefined : 4,
                    animationName: playing ? WAVE_ANIMS[i] : 'none',
                    animationDuration: '0.8s',
                    animationDelay: `${d}s`,
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'ease-in-out',
                    opacity: playing ? 0.9 : 0.3
                  }} />
                ))}
              </div>

              {/* Call button */}
              <div style={{ padding: '0.75rem 1.5rem 1.5rem', textAlign: 'center' }}>
                <button onClick={handlePlay} style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: playing ? '#ef4444' : scenario.color,
                  border: 'none', color: '#fff',
                  fontSize: '1.2rem', cursor: 'pointer',
                  boxShadow: `0 0 20px ${playing ? '#ef4444' : scenario.color}50`,
                  transition: 'all 0.2s'
                }}>
                  {playing ? '✕' : '▶'}
                </button>
                <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                  {playing ? 'stop' : 'simulate call'}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div>
            {/* Scenario selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                scenario
              </div>
              <div className="scenario-btns">
                {SCENARIOS.map((s, i) => (
                  <button key={s.id} onClick={() => handleScenarioChange(i)} style={{
                    padding: '10px 16px', borderRadius: 10, textAlign: 'left',
                    border: `1px solid ${active === i ? s.color + '50' : 'var(--border)'}`,
                    background: active === i ? s.color + '10' : 'transparent',
                    color: active === i ? s.color : 'var(--text2)',
                    fontSize: '13px', fontWeight: 600,
                    transition: 'all 0.2s', cursor: 'pointer'
                  }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transcript */}
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              transcript
            </div>
            <div ref={chatRef} className="glass" style={{
              borderRadius: 16, padding: '1rem',
              height: 280, overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              scrollBehavior: 'smooth'
            }}>
              {visibleTurns.length === 0 && (
                <div style={{ color: 'var(--text3)', fontSize: '12px', fontFamily: 'var(--font-mono)', margin: 'auto', textAlign: 'center' }}>
                  Press ▶ to simulate the conversation
                </div>
              )}
              {visibleTurns.map((turn, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '0.5rem',
                  justifyContent: turn.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  {turn.role === 'agent' && (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: scenario.color + '20', border: `1px solid ${scenario.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', flexShrink: 0, marginTop: 4
                    }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: '80%', padding: '8px 12px', borderRadius: 12,
                    fontSize: '12px', lineHeight: 1.6,
                    background: turn.role === 'agent' ? scenario.color + '15' : 'var(--surface2)',
                    color: turn.role === 'agent' ? scenario.color : 'var(--text)',
                    border: `1px solid ${turn.role === 'agent' ? scenario.color + '30' : 'var(--border)'}`,
                    borderBottomLeftRadius: turn.role === 'agent' ? 4 : 12,
                    borderBottomRightRadius: turn.role === 'user' ? 4 : 12,
                  }}>
                    {turn.text}
                  </div>
                </div>
              ))}
              {playing && currentTurn < scenario.turns.length && (
                <div style={{ display: 'flex', gap: 4, paddingLeft: 32 }}>
                  {[0,0.2,0.4].map((d, i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: scenario.color, opacity: 0.6,
                      animation: 'ping 1s ease-in-out infinite',
                      animationDelay: `${d}s`
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Tech specs */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { k: 'latency',   v: '< 300ms'    },
                { k: 'model',     v: 'custom TTS' },
                { k: 'telephony', v: 'Twilio'     },
                { k: 'transport', v: 'WebRTC'     },
              ].map(s => (
                <div key={s.k} className="glass" style={{ padding: '6px 14px', borderRadius: 8, fontSize: '11px' }}>
                  <span style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{s.k}: </span>
                  <span style={{ color: 'var(--em)', fontFamily: 'var(--font-mono)' }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .voice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .phone-col {
          display: flex;
          justify-content: center;
        }

        .scenario-btns {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          #voice {
            padding: 4rem 0 !important;
          }
          .voice-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .scenario-btns {
            flex-direction: row !important;
            flex-wrap: wrap;
          }
          .scenario-btns button {
            flex: 1 1 auto;
            text-align: center !important;
            min-width: 120px;
          }
        }

        @media (max-width: 480px) {
          #voice {
            padding: 3rem 0 !important;
          }
          .scenario-btns button {
            font-size: 12px !important;
            padding: 8px 10px !important;
          }
        }
      `}</style>
    </section>
  )
}