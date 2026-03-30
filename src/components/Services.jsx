import ServicesCanvas from './ServicesCanvas'

/*
  Services section
  ────────────────
  Dark background, two-column layout:
    Left  — headline + 4 service cards (staggered scroll-reveal via data-reveal)
    Right — ServicesCanvas (4 floating 3D shapes)

  The shape order in ServicesCanvas matches the card order:
    01 Strategy   → Icosahedron  (blue)
    02 Content    → Octahedron   (green)
    03 Talent     → Dodecahedron (coral)
    04 Analytics  → Sphere       (gold)
*/

const SERVICES = [
  {
    num  : '01',
    title: 'Strategy',
    desc : 'Data-driven blueprints that align every channel to a single growth objective.',
    accent: '#1E56FF',
  },
  {
    num  : '02',
    title: 'Content',
    desc : 'Compelling narratives — written, visual, and video — that convert audiences into advocates.',
    accent: '#4ade80',
  },
  {
    num  : '03',
    title: 'Talent',
    desc : 'Vetted, specialist marketers placed inside your team within days, not months.',
    accent: '#ff6b6b',
  },
  {
    num  : '04',
    title: 'Analytics',
    desc : 'Real-time performance intelligence with actionable dashboards and monthly reporting.',
    accent: '#fbbf24',
  },
]

export default function Services () {
  return (
    <section
      id="services-section"
      style={{
        position  : 'relative',
        background: 'var(--black)',
        color     : 'var(--white)',
        minHeight : '100vh',
        display   : 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap       : 0,
        overflow  : 'hidden',
      }}
    >
      {/* ── Left column — copy ───────────────────────────────────────────── */}
      <div
        style={{
          padding   : 'clamp(6rem,12vw,11rem) 5vw clamp(6rem,10vw,10rem) 5vw',
          display   : 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Eyebrow */}
        <p
          data-reveal
          style={{
            fontSize     : '0.62rem',
            fontWeight   : 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5em',
            color        : '#1E56FF',
            marginBottom : '2.5rem',
            margin       : '0 0 2.5rem',
          }}
        >
          What we do
        </p>

        {/* Headline */}
        <h2
          data-reveal
          style={{
            fontFamily   : 'var(--font-display)',
            fontSize     : 'clamp(2.6rem,5.5vw,5rem)',
            fontWeight   : 700,
            lineHeight   : 0.92,
            letterSpacing: '-0.04em',
            margin       : '0 0 clamp(3rem,6vw,5.5rem)',
          }}
        >
          Full-service<br />
          <span style={{ color: 'rgba(255,255,255,0.28)' }}>marketing</span><br />
          talent.
        </h2>

        {/* Service cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {SERVICES.map(({ num, title, desc, accent }) => (
            <div
              key={num}
              data-reveal
              style={{
                borderTop : '1px solid rgba(255,255,255,0.08)',
                padding   : '1.6rem 0',
                display   : 'grid',
                gridTemplateColumns: '2.8rem 1fr',
                gap       : '1.2rem',
                alignItems: 'start',
                cursor    : 'none',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderTopColor = accent }}
              onMouseLeave={e => { e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.08)' }}
            >
              {/* Number */}
              <span
                style={{
                  fontSize     : '0.58rem',
                  fontWeight   : 500,
                  letterSpacing: '0.12em',
                  color        : accent,
                  paddingTop   : '0.3rem',
                  textTransform: 'uppercase',
                }}
              >
                {num}
              </span>

              <div>
                <div
                  style={{
                    fontFamily   : 'var(--font-display)',
                    fontSize     : 'clamp(1.05rem,2vw,1.3rem)',
                    fontWeight   : 600,
                    letterSpacing: '-0.02em',
                    marginBottom : '0.5rem',
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize  : 'clamp(0.82rem,1.2vw,0.95rem)',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    color     : 'rgba(255,255,255,0.48)',
                  }}
                >
                  {desc}
                </div>
              </div>
            </div>
          ))}
          {/* Bottom border */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
      </div>

      {/* ── Right column — 3D canvas ─────────────────────────────────────── */}
      <div
        style={{
          position : 'relative',
          minHeight: '60vh',
        }}
      >
        {/* Subtle radial glow behind the shapes */}
        <div
          style={{
            position    : 'absolute',
            inset       : 0,
            background  : 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(30,86,255,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <ServicesCanvas />
      </div>

      {/* ── Mobile: stack vertically ─────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          #services-section {
            grid-template-columns: 1fr !important;
          }
          #services-section > div:last-child {
            min-height: 50vw !important;
          }
        }
      `}</style>
    </section>
  )
}
