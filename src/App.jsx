import { useEffect, useRef } from 'react'
import Hero from './components/Hero'

/* ── Custom cursor ──────────────────────────────────────────────────────────── */
function Cursor () {
  const dot      = useRef(null)
  const ring     = useRef(null)
  const mouse    = useRef({ x: 0, y: 0 })
  const current  = useRef({ x: 0, y: 0 })
  const rafId    = useRef(null)

  useEffect(() => {
    const onMove = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      current.current.x += (mouse.current.x - current.current.x) * 0.12
      current.current.y += (mouse.current.y - current.current.y) * 0.12
      if (ring.current) {
        ring.current.style.left = current.current.x + 'px'
        ring.current.style.top  = current.current.y + 'px'
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  const snap = e => {
    if (dot.current) {
      dot.current.style.left = e.clientX + 'px'
      dot.current.style.top  = e.clientY + 'px'
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', snap)
    return () => window.removeEventListener('mousemove', snap)
  }, [])

  return (
    <>
      <div ref={dot}  className="cursor" />
      <div ref={ring} className="cursor-follower" />
    </>
  )
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
function Header () {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, width: '100%',
      padding: '2.5rem 2.5rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 500,
      transition: 'background 0.4s, padding 0.4s',
    }} id="site-header">
      <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em', cursor: 'pointer' }}>
        marketeam
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <nav style={{ display: 'flex', gap: '2.5rem' }}>
          {['Strategy', 'Talent', 'Success'].map(l => (
            <a key={l} href="#" style={{
              fontSize: '0.72rem', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.22em',
              textDecoration: 'none', color: '#1a1a1a',
              transition: 'color 0.3s',
            }}>
              {l}
            </a>
          ))}
        </nav>
        <span style={{
          fontSize: '0.72rem', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.22em',
          borderBottom: '2px solid #1a1a1a', paddingBottom: '0.2rem',
          cursor: 'pointer',
        }}>
          Menu ≡
        </span>
      </div>
    </header>
  )
}

/* ── Philosophy section ─────────────────────────────────────────────────────── */
function Philosophy () {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      padding: 'clamp(5rem,8vw,9rem) clamp(2rem,10vw,8rem)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      background: '#f9fafb',
    }}>
      <div style={{ maxWidth: '60rem' }}>
        <h2 style={{
          fontSize: 'clamp(2.2rem,6vw,5.5rem)',
          fontWeight: 800, lineHeight: 0.92,
          letterSpacing: '-0.045em', margin: '0 0 3rem',
        }}>
          Our goal is more than staffing.{' '}
          We build{' '}
          <span style={{ color: '#0055ff' }}>marketing engines</span>
          {' '}that inspire.
        </h2>
        <div style={{ width: '6rem', height: '4px', background: '#0055ff', marginBottom: '3.5rem' }} />
        <p style={{
          fontSize: 'clamp(1.2rem,2vw,2rem)',
          color: '#6b7280', fontWeight: 500,
          lineHeight: 1.5, maxWidth: '44rem', margin: 0,
        }}>
          No matter the scale, we take your vision and inject it with elite
          talent required to dominate. Fast, efficient, and precise.
        </p>
      </div>
    </section>
  )
}

/* ── Metrics section ────────────────────────────────────────────────────────── */
const STATS = [
  { value: '2018', label: 'Established' },
  { value: '500+', label: 'Talent Pool'  },
  { value: '100%', label: 'Vetted'       },
  { value: '∞',    label: 'Execution'   },
]

function Metrics () {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      padding: 'clamp(5rem,8vw,9rem) clamp(2rem,10vw,8rem)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      background: '#0055ff', color: '#fff',
      overflow: 'hidden',
    }}>
      <p style={{
        fontSize: '0.7rem', fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '0.5em',
        opacity: 0.4, marginBottom: '5rem',
      }}>
        Key Advantage
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
        {STATS.map(({ value, label }) => (
          <div key={label} style={{
            borderRadius: '2.5rem',
            padding: '3.5rem 2.5rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            transition: 'transform 0.5s cubic-bezier(.23,1,.32,1), background 0.5s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-12px)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            <div style={{ fontSize: 'clamp(3.5rem,6vw,5.5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.6 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Footer / CTA ───────────────────────────────────────────────────────────── */
function Footer () {
  return (
    <footer style={{
      position: 'relative',
      minHeight: '100vh',
      padding: 'clamp(5rem,8vw,9rem) clamp(2rem,10vw,8rem)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      background: '#0a0a0a', color: '#fff',
    }}>
      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '5rem 0 8rem' }}>
        <p style={{
          fontSize: '0.65rem', fontWeight: 800, color: '#0055ff',
          textTransform: 'uppercase', letterSpacing: '0.45em', marginBottom: '3rem',
        }}>
          Ready to grow?
        </p>
        <h2 style={{
          fontSize: 'clamp(2.5rem,7vw,7rem)',
          fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.92, margin: 0,
        }}>
          You have a project idea.<br />
          <span style={{
            color: '#4ade80',
            borderBottom: '0.12em solid #4ade80',
            cursor: 'pointer',
            transition: 'color 0.4s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4ade80' }}
          >
            Tell us about it!
          </span>
        </h2>
      </div>

      {/* Links grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
        gap: '4rem',
        opacity: 0.38,
        fontSize: '0.62rem', fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '0.22em',
      }}>
        {[
          { heading: 'Connect',    items: ['hello@marketeam.io', '+44 20 7946 0958'] },
          { heading: 'Location',   items: ['London, SE1 7PB', 'United Kingdom'] },
          { heading: 'Network',    items: ['LinkedIn', 'Instagram', 'Behance'] },
          { heading: 'Compliance', items: ['Privacy Policy', 'Terms of Use', 'Cookies'] },
        ].map(({ heading, items }) => (
          <div key={heading}>
            <p style={{ color: '#6b7280', marginBottom: '1.2rem' }}>{heading}</p>
            {items.map(i => (
              <p key={i} style={{ fontSize: '0.8rem', marginBottom: '0.6rem', cursor: 'pointer' }}>{i}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        marginTop: '5rem', paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-between',
        opacity: 0.18, fontSize: '0.55rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.25em',
      }}>
        <span>© 2026 marketeam global limited.</span>
        <span>Built for the future of marketing</span>
      </div>
    </footer>
  )
}

/* ── Scroll-based header shrink ─────────────────────────────────────────────── */
function useHeaderScroll () {
  useEffect(() => {
    const header = document.getElementById('site-header')
    if (!header) return
    const onScroll = () => {
      if (window.scrollY > 80) {
        header.style.background     = 'rgba(255,255,255,0.85)'
        header.style.backdropFilter = 'blur(12px)'
        header.style.padding        = '1.2rem 2.5rem'
      } else {
        header.style.background     = 'transparent'
        header.style.backdropFilter = 'none'
        header.style.padding        = '2.5rem 2.5rem'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

/* ── Root ───────────────────────────────────────────────────────────────────── */
export default function App () {
  useHeaderScroll()

  return (
    <>
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Philosophy />
        <Metrics />
        <Footer />
      </main>
    </>
  )
}
