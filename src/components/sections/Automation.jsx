import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── WORKFLOW DATA ────────────────────────────────────────────── */
const WORKFLOWS = [
  {
    id: 'zaiqa',
    label: 'Zaiqa Instagram Bot',
    accent: '#f97316',
    description: 'Auto-handles Instagram DMs — classifies intent, extracts order info, replies instantly.',
    nodes: [
      {
        id: 'trigger', x: 60,  y: 130, type: 'trigger',
        label: 'Instagram DM',   sublabel: 'Trigger',
        icon: '', color: '#1c1410', border: '#f9731640',
        statusColor: '#f97316',
      },
      {
        id: 'classify', x: 260, y: 130, type: 'ai',
        label: 'Intent AI',      sublabel: 'Groq / LLaMA',
        icon: '', color: '#101c10', border: '#22c55e40',
        statusColor: '#22c55e',
      },
      {
        id: 'router', x: 460, y: 60,  type: 'router',
        label: 'Order?',         sublabel: 'If / Else',
        icon: '', color: '#10101c', border: '#818cf840',
        statusColor: '#818cf8',
      },
      {
        id: 'extract', x: 460, y: 200, type: 'ai',
        label: 'FAQ Answer',     sublabel: 'LLM Response',
        icon: '', color: '#101c10', border: '#22c55e40',
        statusColor: '#22c55e',
      },
      {
        id: 'confirm', x: 660, y: 60,  type: 'action',
        label: 'Extract Order',  sublabel: 'Data Parser',
        icon: '', color: '#1c1008', border: '#fb923c40',
        statusColor: '#fb923c',
      },
      {
        id: 'reply',   x: 660, y: 200, type: 'action',
        label: 'Send Reply',     sublabel: 'Meta Graph API',
        icon: '', color: '#0e1a0e', border: '#4ade8040',
        statusColor: '#4ade80',
      },
      {
        id: 'notify',  x: 860, y: 60,  type: 'action',
        label: 'Notify Owner',   sublabel: 'WhatsApp Alert',
        icon: '', color: '#1c1410', border: '#f9731640',
        statusColor: '#f97316',
      },
      {
        id: 'log',     x: 860, y: 200, type: 'action',
        label: 'Log to Sheet',   sublabel: 'Google Sheets',
        icon: '', color: '#0e1a0e', border: '#4ade8040',
        statusColor: '#4ade80',
      },
    ],
    edges: [
      { from: 'trigger',  to: 'classify', label: '' },
      { from: 'classify', to: 'router',   label: '' },
      { from: 'classify', to: 'extract',  label: '' },
      { from: 'router',   to: 'confirm',  label: 'true' },
      { from: 'extract',  to: 'reply',    label: '' },
      { from: 'confirm',  to: 'notify',   label: '' },
      { from: 'confirm',  to: 'log',      label: '' },
      { from: 'reply',    to: 'log',      label: '' },
    ],
    metrics: [
      { val: '3h',  label: 'saved / day'  },
      { val: '40%', label: 'more orders'  },
      { val: '0',   label: 'missed DMs'   },
    ],
  },
  {
    id: 'velour',
    label: 'Velour Support Bot',
    accent: '#c084fc',
    description: 'Website widget + RAG pipeline — routes complex queries to GPT-4, simple ones to cached answers.',
    nodes: [
      {
        id: 'widget', x: 60,  y: 130, type: 'trigger',
        label: 'Widget Message', sublabel: 'Trigger',
        icon: '💬', color: '#12101c', border: '#c084fc40',
        statusColor: '#c084fc',
      },
      {
        id: 'router', x: 260, y: 130, type: 'router',
        label: 'LLM Router',    sublabel: 'Groq Classify',
        icon: '⚡', color: '#10101c', border: '#818cf840',
        statusColor: '#818cf8',
      },
      {
        id: 'rag',    x: 460, y: 50,  type: 'ai',
        label: 'RAG Lookup',    sublabel: 'ChromaDB',
        icon: '📚', color: '#101c10', border: '#22c55e40',
        statusColor: '#22c55e',
      },
      {
        id: 'cache',  x: 460, y: 210, type: 'action',
        label: 'Cache Hit',     sublabel: 'Redis Store',
        icon: '⚡', color: '#1c1a10', border: '#facc1540',
        statusColor: '#facc15',
      },
      {
        id: 'gpt4',   x: 660, y: 50,  type: 'ai',
        label: 'GPT-4o',        sublabel: 'OpenAI',
        icon: '🧠', color: '#101c10', border: '#22c55e40',
        statusColor: '#22c55e',
      },
      {
        id: 'format', x: 660, y: 210, type: 'ai',
        label: 'Format Answer', sublabel: 'Claude Haiku',
        icon: '✨', color: '#12101c', border: '#c084fc40',
        statusColor: '#c084fc',
      },
      {
        id: 'send',   x: 860, y: 130, type: 'action',
        label: 'Send Response', sublabel: 'WebSocket',
        icon: '✉️', color: '#0e1a0e', border: '#4ade8040',
        statusColor: '#4ade80',
      },
    ],
    edges: [
      { from: 'widget', to: 'router', label: '' },
      { from: 'router', to: 'rag',    label: 'complex' },
      { from: 'router', to: 'cache',  label: 'simple' },
      { from: 'rag',    to: 'gpt4',   label: '' },
      { from: 'cache',  to: 'format', label: '' },
      { from: 'gpt4',   to: 'send',   label: '' },
      { from: 'format', to: 'send',   label: '' },
    ],
    metrics: [
      { val: '< 2s', label: 'response time'   },
      { val: '80%',  label: 'deflection rate' },
      { val: '24/7', label: 'availability'    },
    ],
  },
]

/* ─── NODE TYPE BADGE ──────────────────────────────────────────── */
const TYPE_BADGE = {
  trigger: { label: 'TRIGGER', bg: '#f9731618', color: '#f97316' },
  ai:      { label: 'AI',      bg: '#22c55e18', color: '#22c55e' },
  router:  { label: 'ROUTER',  bg: '#818cf818', color: '#818cf8' },
  action:  { label: 'ACTION',  bg: '#4ade8018', color: '#4ade80' },
}

/* ─── BEZIER BETWEEN TWO NODES ─────────────────────────────────── */
const NODE_W = 130
const NODE_H = 68

function getEdgePoints(fromNode, toNode) {
  const x1 = fromNode.x + NODE_W
  const y1 = fromNode.y + NODE_H / 2
  const x2 = toNode.x
  const y2 = toNode.y + NODE_H / 2
  const cx = (x1 + x2) / 2
  return { x1, y1, x2, y2, cx }
}

function buildPath(p) {
  return `M${p.x1},${p.y1} C${p.cx},${p.y1} ${p.cx},${p.y2} ${p.x2},${p.y2}`
}

/* ─── SINGLE WORKFLOW CANVAS ────────────────────────────────────── */
function WorkflowCanvas({ wf, visible }) {
  const canvasRef  = useRef(null)
  const svgRef     = useRef(null)
  const [packets, setPackets] = useState([])
  const tickRef    = useRef(0)
  const rafRef     = useRef(null)
  const nodeMap    = Object.fromEntries(wf.nodes.map(n => [n.id, n]))

  // Animate nodes in on mount / tab switch
  useEffect(() => {
    if (!canvasRef.current || !visible) return
    const nodes = canvasRef.current.querySelectorAll('.wf-node')
    gsap.fromTo(nodes,
      { opacity: 0, y: 14, scale: 0.92 },
      { opacity: 1, y: 0,  scale: 1, stagger: 0.07, duration: 0.45, ease: 'back.out(1.4)' }
    )
    const lines = svgRef.current?.querySelectorAll('.edge-path')
    if (lines) {
      lines.forEach(l => {
        const len = l.getTotalLength()
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(l,  { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', delay: 0.4 })
      })
    }
  }, [visible, wf.id])

  // Packet ticker
  useEffect(() => {
    if (!visible) return
    const edges = wf.edges
    let id = 0

    const spawnPacket = () => {
      const ei = Math.floor(Math.random() * edges.length)
      const edge = edges[ei]
      const from = nodeMap[edge.from]
      const to   = nodeMap[edge.to]
      if (!from || !to) return
      const p = getEdgePoints(from, to)
      setPackets(prev => [...prev, { id: id++, path: buildPath(p), color: wf.accent, progress: 0 }])
    }

    const tick = () => {
      tickRef.current++
      if (tickRef.current % 38 === 0) spawnPacket()
      setPackets(prev =>
        prev
          .map(pk => ({ ...pk, progress: pk.progress + 0.018 }))
          .filter(pk => pk.progress < 1)
      )
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [visible, wf.id])

  // Canvas width/height from node positions
  const maxX = Math.max(...wf.nodes.map(n => n.x + NODE_W + 60))
  const maxY = Math.max(...wf.nodes.map(n => n.y + NODE_H + 60))

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'relative',
        width: maxX,
        height: maxY,
        minWidth: '100%',
      }}
    >
      {/* SVG layer — edges */}
      <svg
        ref={svgRef}
        style={{ position: 'absolute', inset: 0, width: maxX, height: maxY, overflow: 'visible', pointerEvents: 'none' }}
      >
        <defs>
          <marker id={`arr-${wf.id}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,1 L6,3.5 L0,6 Z" fill={wf.accent + '90'} />
          </marker>
        </defs>

        {/* Static edge paths */}
        {wf.edges.map((edge, i) => {
          const from = nodeMap[edge.from]
          const to   = nodeMap[edge.to]
          if (!from || !to) return null
          const p = getEdgePoints(from, to)
          const d = buildPath(p)
          return (
            <g key={i}>
              {/* Track */}
              <path d={d} fill="none" stroke={wf.accent + '18'} strokeWidth="1.5" />
              {/* Animated edge */}
              <path
                className="edge-path"
                d={d} fill="none"
                stroke={wf.accent + '55'} strokeWidth="1.5"
                markerEnd={`url(#arr-${wf.id})`}
              />
              {/* Edge label */}
              {edge.label && (
                <text
                  x={(p.x1 + p.x2) / 2} y={(p.y1 + p.y2) / 2 - 6}
                  textAnchor="middle" fontSize="9"
                  fontFamily="monospace" fill={wf.accent + 'aa'}
                >{edge.label}</text>
              )}
            </g>
          )
        })}

        {/* Animated data packets */}
        {packets.map(pk => {
          // Interpolate point on path via a temp SVG path
          return (
            <PacketDot key={pk.id} pathD={pk.path} progress={pk.progress} color={pk.color} />
          )
        })}
      </svg>

      {/* Nodes */}
      {wf.nodes.map(node => {
        const badge = TYPE_BADGE[node.type] || TYPE_BADGE.action
        return (
          <div
            key={node.id}
            className="wf-node"
            style={{
              position: 'absolute',
              left: node.x, top: node.y,
              width: NODE_W, height: NODE_H,
              opacity: 0,
            }}
          >
            <div
              style={{
                width: '100%', height: '100%',
                background: node.color,
                border: `1px solid ${node.border}`,
                borderRadius: 10,
                padding: '7px 10px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                cursor: 'default',
                transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = node.statusColor + 'aa'
                e.currentTarget.style.boxShadow   = `0 0 18px ${node.statusColor}22`
                e.currentTarget.style.transform   = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = node.border
                e.currentTarget.style.boxShadow   = 'none'
                e.currentTarget.style.transform   = 'translateY(0)'
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${node.statusColor}80, transparent)`,
                borderRadius: '10px 10px 0 0',
              }} />

              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{node.icon}</span>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  fontFamily: 'var(--font-mono)', color: '#e2e8f0',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{node.label}</span>
              </div>

              {/* Footer row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace' }}>{node.sublabel}</span>
                <span style={{
                  fontSize: '8px', fontWeight: 700, fontFamily: 'monospace',
                  background: badge.bg, color: badge.color,
                  padding: '1px 5px', borderRadius: 4, letterSpacing: '0.05em',
                }}>{badge.label}</span>
              </div>

              {/* Status dot */}
              <div style={{
                position: 'absolute', top: 7, right: 7,
                width: 5, height: 5, borderRadius: '50%',
                background: node.statusColor,
                boxShadow: `0 0 5px ${node.statusColor}`,
                animation: 'statusPulse 2s infinite',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── PACKET DOT (interpolated on SVG path) ─────────────────────── */
function PacketDot({ pathD, progress, color }) {
  const pathRef = useRef(null)
  const [pos, setPos] = useState(null)

  useEffect(() => {
    if (!pathRef.current) return
    try {
      const len = pathRef.current.getTotalLength()
      const pt  = pathRef.current.getPointAtLength(len * Math.min(progress, 0.999))
      setPos({ x: pt.x, y: pt.y })
    } catch {}
  }, [progress, pathD])

  return (
    <>
      <path ref={pathRef} d={pathD} fill="none" stroke="none" style={{ position: 'absolute', visibility: 'hidden' }} />
      {pos && (
        <circle cx={pos.x} cy={pos.y} r="4" fill={color}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
          opacity={progress > 0.85 ? 1 - (progress - 0.85) / 0.15 : 1}
        />
      )}
    </>
  )
}

/* ─── MAIN SECTION ──────────────────────────────────────────────── */
export default function Automation() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const [activeWf, setActiveWf] = useState(0)
  const [visible,  setVisible]  = useState(false)

  const wf = WORKFLOWS[activeWf]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true } }
      )
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => setVisible(true),
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const switchTab = (i) => {
    setVisible(false)
    setActiveWf(i)
    requestAnimationFrame(() => setVisible(true))
  }

  return (
    <section
      id="automation"
      ref={sectionRef}
      style={{ padding: '8rem 0', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}
    >
      {/* pulse keyframe */}
      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>

      {/* Subtle bg grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-eyebrow">automation</div>

        <div ref={titleRef} style={{ opacity: 0, marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
            AI workflows that<br />
            <span className="gradient-text">run while you sleep</span>
          </h2>
          <p style={{ color: 'var(--text2)', maxWidth: 520, lineHeight: 1.7 }}>
            Every automation is a custom pipeline — built with Python, Meta APIs, and intelligent LLM routing.
            No generic templates. No drag-and-drop limitations.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {WORKFLOWS.map((w, i) => (
            <button
              key={w.id}
              onClick={() => switchTab(i)}
              style={{
                padding: '8px 20px', borderRadius: 100,
                border: `1px solid ${activeWf === i ? w.accent + '60' : 'var(--border)'}`,
                background: activeWf === i ? w.accent + '15' : 'transparent',
                color: activeWf === i ? w.accent : 'var(--text2)',
                fontSize: '13px', fontWeight: 600,
                transition: 'all 0.2s', cursor: 'pointer',
              }}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Canvas card */}
        <div className="glass" style={{
          borderRadius: 20,
          border: `1px solid ${wf.accent}18`,
          background: 'rgba(8,10,12,0.7)',
          backdropFilter: 'blur(24px)',
          boxShadow: `0 0 60px ${wf.accent}08`,
          overflow: 'hidden',
        }}>
          {/* Top bar — n8n style */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px',
            borderBottom: `1px solid ${wf.accent}18`,
            background: 'rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
              ))}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'monospace', marginLeft: 8 }}>
              workflow / {wf.id}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
              <span style={{ fontSize: '10px', color: '#4ade80', fontFamily: 'monospace' }}>ACTIVE</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: '10px 20px 0', fontSize: '12px', color: 'var(--text3)', fontFamily: 'monospace' }}>
            {wf.description}
          </div>

          {/* Scrollable canvas */}
          <div style={{ overflowX: 'auto', overflowY: 'hidden', padding: '24px 24px 16px' }}>
            <WorkflowCanvas wf={wf} visible={visible} />
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 20px',
            borderTop: `1px solid ${wf.accent}12`,
            background: 'rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: '10px', color: 'var(--text3)', fontFamily: 'monospace',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: wf.accent, boxShadow: `0 0 5px ${wf.accent}` }} />
            live data flow simulation — {wf.nodes.length} nodes · {wf.edges.length} connections · packets flowing
          </div>
        </div>

        {/* Metrics + Bottom bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', marginTop: '1.5rem', alignItems: 'stretch' }}>
          {/* Metrics */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {wf.metrics.map((m, i) => (
              <div key={i} className="glass" style={{
                padding: '1.1rem 1.4rem', borderRadius: 14, textAlign: 'center',
                border: `1px solid ${wf.accent}18`,
                background: wf.accent + '06',
                minWidth: 90,
              }}>
                <div style={{
                  fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                  color: wf.accent, lineHeight: 1, marginBottom: 5,
                }}>{m.val}</div>
                <div style={{ fontSize: '10px', color: 'var(--text2)', letterSpacing: '0.04em' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* CTA bar */}
          <div className="glass" style={{
            padding: '1.1rem 1.5rem', borderRadius: 14,
            display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
            border: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--em)' }}>14h</span>
                <span style={{ fontSize: '12px', color: 'var(--text2)' }}>saved / week across all automations</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                Production-grade, monitored pipelines built to handle edge cases.
              </div>
            </div>
            <a
              href="#contact"
              style={{
                marginLeft: 'auto', padding: '10px 22px', borderRadius: 10,
                background: 'var(--em-dim)', border: '1px solid var(--border2)',
                color: 'var(--em)', fontWeight: 600, fontSize: '13px',
                textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--em)'; e.currentTarget.style.color = '#000' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--em-dim)'; e.currentTarget.style.color = 'var(--em)' }}
            >
              Build my automation →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
