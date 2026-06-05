import { useEffect, useState } from 'react'

const links = [
  { label: 'Work', href: '#projects' },
  { label: 'Automations', href: '#automation' },
  { label: 'Voice AI', href: '#voice' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header>
      <nav
        className={`${
          scrolled ? 'scrolled' : ''
        } flex items-center justify-between px-4 py-4 w-full`}
      >
        <a href="#hero" className="logo text-xl font-bold">
          saaram<span>.</span>
        </a>

        {/* Desktop Links */}
        {!isMobile && (
          <ul
            className="nav-links flex gap-6 text-base"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="hover:opacity-70 transition"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <a href="#contact" className="nav-cta">
            Let's build →
          </a>

          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '22px',
                color: 'inherit',
                padding: '4px',
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isMobile && menuOpen && (
        <div
          className="mobile-dropdown"
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 16px 20px',
            gap: '16px',
          }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '16px',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}