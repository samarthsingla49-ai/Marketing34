import { useEffect, useRef } from 'react'
import Hero from './components/Hero'
import { useGsapReveal } from './hooks/useGsapReveal'

/* ── Custom cursor (replaces system cursor) ─────────────────────────────────── */
function CustomCursor () {
  // Don't render on touch/pointer-coarse devices (phones, tablets)
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  const dot  = useRef(null)
  const ring = useRef(null)
  const pos  = useRef({ x: 0, y: 0 })
  const lag  = useRef({ x: 0, y: 0 })
  const raf  = useRef(null)

  useEffect(() => {
    const onMove = e => { pos.current.x = e.clientX; pos.current.y = e.clientY }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.11
      lag.current.y += (pos.current.y - lag.current.y) * 0.11
      if (dot.current)  dot.current.style.transform  = `translate(${pos.current.x}px,${pos.current.y}px) translate(-50%,-50%)`
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x}px,${lag.current.y}px) translate(-50%,-50%)`
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    // Expand ring on hoverable elements
    const expand   = () => ring.current?.classList.add('expanded')
    const collapse = () => ring.current?.classList.remove('expanded')
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', collapse)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dot}  className="cursor-dot"  />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}

/* ── Navigation — ultra-minimal, logo + MENU only ───────────────────────────── */
function Header () {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      if (window.scrollY > 60) {
        el.style.background     = 'rgba(255,255,255,0.88)'
        el.style.backdropFilter = 'blur(14px)'
        el.style.padding        = '1rem 5vw'
      } else {
        el.style.background     = 'transparent'
        el.style.backdropFilter = 'none'
        el.style.padding        = '1.75rem 5vw'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      ref={ref}
      style={{
        position  : 'fixed',
        top       : 0, left: 0, right: 0,
        zIndex    : 500,
        display   : 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding   : '1.75rem 5vw',
        transition: 'background 0.4s, backdrop-filter 0.4s, padding 0.4s',
      }}
    >
      <a
        href="/"
        style={{
          fontFamily   : 'var(--font-display)',
          fontSize     : '1.15rem',
          fontWeight   : 700,
          letterSpacing: '-0.03em',
          textDecoration: 'none',
          color        : 'var(--black)',
        }}
      >
        marketeam
      </a>

      <button
        style={{
          fontFamily   : 'var(--font-body)',
          display      : 'flex',
          alignItems   : 'center',
          gap          : '10px',
          background   : 'none',
          border       : 'none',
          cursor       : 'none',
          fontSize     : '11px',
          fontWeight   : 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color        : 'var(--black)',
        }}
      >
        Menu
        <span style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ width: '20px', height: '1.5px', background: 'var(--black)', display: 'block' }} />
          <span style={{ width: '14px', height: '1.5px', background: 'var(--black)', display: 'block' }} />
        </span>
      </button>
    </header>
  )
}

/* ── Philosophy ─────────────────────────────────────────────────────────────── */
function Philosophy () {
  return (
    <section
      style={{
        padding   : 'clamp(6rem,12vw,12rem) 5vw',
        background: 'var(--white)',
        maxWidth  : '900px',
      }}
    >
      <p
        data-reveal
        style={{
          fontFamily   : 'var(--font-body)',
          fontSize     : 'clamp(1.4rem, 3vw, 2.4rem)',
          fontWeight   : 300,
          lineHeight   : 1.38,
          letterSpacing: '-0.01em',
          color        : 'var(--black)',
          margin       : 0,
        }}
      >
        Our goal is more than staffing.{' '}
        We build{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--blue)' }}>
          marketing engines
        </em>{' '}
        that inspire.
      </p>

      <div
        data-reveal
        style={{ width: '4rem', height: '3px', background: 'var(--blue)', marginTop: '4rem' }}
      />

      <p
        data-reveal
        style={{
          fontFamily: 'var(--font-body)',
          fontSize  : 'clamp(1rem, 1.5vw, 1.3rem)',
          fontWeight: 300,
          lineHeight: 1.6,
          color     : '#666',
          marginTop : '2.5rem',
          maxWidth  : '44rem',
        }}
      >
        No matter the scale, we take your vision and inject it with elite
        talent required to dominate. Fast, efficient, and precise.
      </p>
    </section>
  )
}

/* ── Metrics ─────────────────────────────────────────────────────────────────── */
const STATS = [
  { v: '2018', l: 'Established' },
  { v: '500+', l: 'Talent Pool'  },
  { v: '100%', l: 'Vetted'       },
  { v: '∞',    l: 'Execution'   },
]

function Metrics () {
  return (
    <section
      data-reveal
      style={{
        background: 'var(--blue)',
        color     : 'var(--white)',
        padding   : 'clamp(5rem,10vw,10rem) 5vw',
      }}
    >
      <p style={{ fontSize: '0.65rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5em', opacity: 0.45, marginBottom: '4rem' }}>
        Key Advantage
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.5rem' }}>
        {STATS.map(({ v, l }) => (
          <div
            key={l}
            style={{
              borderRadius: '2rem',
              padding     : '3rem 2rem',
              border      : '1px solid rgba(255,255,255,0.14)',
              background  : 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(16px)',
              transition  : 'transform 0.45s cubic-bezier(.23,1,.32,1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ fontSize: 'clamp(3rem,5.5vw,5rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.8rem' }}>{v}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.6 }}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Footer / CTA ────────────────────────────────────────────────────────────── */
function Footer () {
  return (
    <footer style={{ background: 'var(--black)', color: 'var(--white)', padding: 'clamp(5rem,10vw,10rem) 5vw' }}>
      <div data-reveal style={{ paddingBottom: '6rem' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.45em', marginBottom: '2rem' }}>
          Ready to grow?
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,7vw,7rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9, margin: 0 }}>
          You have a project idea.<br />
          <span
            style={{ color: '#4ade80', borderBottom: '0.08em solid #4ade80', cursor: 'none', transition: 'color 0.4s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4ade80' }}
          >
            Tell us about it!
          </span>
        </h2>
      </div>

      <div className="footer-links-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '3rem', opacity: 0.38, fontSize: '0.62rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
        {[
          { h: 'Connect',    items: ['hello@marketeam.io', '+44 20 7946 0958'] },
          { h: 'Location',   items: ['London, SE1 7PB', 'United Kingdom'] },
          { h: 'Network',    items: ['LinkedIn', 'Instagram', 'Behance'] },
          { h: 'Compliance', items: ['Privacy Policy', 'Terms of Use', 'Cookies'] },
        ].map(({ h, items }) => (
          <div key={h}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{h}</p>
            {items.map(i => <p key={i} style={{ fontSize: '0.78rem', marginBottom: '0.5rem' }}>{i}</p>)}
          </div>
        ))}
      </div>

      <div className="footer-bottom" style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', opacity: 0.2, fontSize: '0.55rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
        <span>© 2026 marketeam global limited.</span>
        <span>Built for the future of marketing</span>
      </div>
    </footer>
  )
}

/* ── Root ────────────────────────────────────────────────────────────────────── */
export default function App () {
  useGsapReveal()    // GSAP hero entrance + scroll reveals

  return (
    <>
      <CustomCursor />
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
