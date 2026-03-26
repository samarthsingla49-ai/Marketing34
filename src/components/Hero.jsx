import RibbonScene from './RibbonScene'

/*
  Z-index weave (torus canvas at z-index 5):
  ┌─────────────────────────────────────────┐
  │ "We unlock"   z:1  ← torus IN FRONT    │
  │ "top [marketing talent.]" z:15 ← torus BEHIND │
  │ (tagline/button)  z:1                  │
  └─────────────────────────────────────────┘

  isolation:"isolate" on the section scopes all z-indices so the
  fixed header (z:500) never bleeds in.
*/

export default function Hero () {
  return (
    <section
      id="hero-section"
      style={{
        position      : 'relative',
        isolation     : 'isolate',
        height        : '100vh',
        display       : 'flex',
        flexDirection : 'column',
        justifyContent: 'center',
        overflow      : 'hidden',
        background    : 'var(--white)',
        padding       : '0 5vw',
      }}
    >
      {/* ── 3D canvas (z-index 5) ──────────────────────────────────────────── */}
      <RibbonScene />

      {/* ── Hero headline ────────────────────────────────────────────────────
          Two lines matching the Atuin rhythm:
            Line 1 — BEHIND torus (z:1)
            Line 2 — IN FRONT of torus (z:15), contains the large pill word
      ─────────────────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', maxWidth: '95vw' }}>
        <h1
          style={{
            fontFamily   : 'var(--font-display)',
            fontSize     : 'clamp(4rem, 11.5vw, 10.5rem)',
            fontWeight   : 700,
            lineHeight   : 0.88,
            letterSpacing: '-0.04em',
            color        : 'var(--black)',
            margin       : '0 0 clamp(2.5rem,5vw,5rem)',
          }}
        >
          {/* LINE 1 — behind torus */}
          <span
            className="hero-line"
            style={{ display: 'block', position: 'relative', zIndex: 1 }}
          >
            We unlock
          </span>

          {/* LINE 2 — in front of torus.
              "top" stays as a small italic pill (like Atuin's "into").
              "marketing" gets the large rectangular box (like Atuin's "software"). */}
          <span
            className="hero-line"
            style={{
              display : 'block',
              position: 'relative',
              zIndex  : 15,
              marginTop: '0.08em',
            }}
          >
            {/* Small italic pill — "into" equivalent */}
            <span
              style={{
                display      : 'inline-flex',
                alignItems   : 'center',
                border       : '2.5px solid var(--black)',
                borderRadius : '999px',
                padding      : '0 0.32em',
                fontStyle    : 'italic',
                fontWeight   : 400,
                height       : '0.88em',
                verticalAlign: 'middle',
                marginRight  : '0.18em',
              }}
            >
              top
            </span>

            {/* Large rectangular box — "software" equivalent */}
            <span
              style={{
                display      : 'inline-block',
                border       : '2.5px solid var(--black)',
                borderRadius : '0.18em',
                padding      : '0.04em 0.3em',
                lineHeight   : 1,
                verticalAlign: 'middle',
              }}
            >
              marketing
            </span>
          </span>

          {/* LINE 3 — behind torus */}
          <span
            className="hero-line"
            style={{
              display  : 'block',
              position : 'relative',
              zIndex   : 1,
              marginTop: '0.06em',
            }}
          >
            talent.
          </span>
        </h1>

        {/* ── Sub-copy + CTA ───────────────────────────────────────────────── */}
        <div
          style={{
            display       : 'flex',
            flexWrap      : 'wrap',
            alignItems    : 'center',
            gap           : '2.5rem',
            position      : 'relative',
            zIndex        : 1,
          }}
        >
          <p
            data-reveal
            style={{
              fontFamily: 'var(--font-body)',
              fontSize  : 'clamp(1rem, 1.6vw, 1.5rem)',
              fontWeight: 300,
              lineHeight: 1.5,
              color     : '#555',
              maxWidth  : '28rem',
              margin    : 0,
            }}
          >
            Connect with vetted marketing specialists who deliver results.
            From strategy to execution — fast, efficient, precise.
          </p>

          <button
            data-reveal
            style={{
              fontFamily   : 'var(--font-body)',
              background   : 'var(--black)',
              color        : 'var(--white)',
              border       : 'none',
              borderRadius : '999px',
              padding      : '1.1rem 2.8rem',
              fontSize     : '0.95rem',
              fontWeight   : 500,
              letterSpacing: '0.01em',
              cursor       : 'none',
              transition   : 'background 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--black)' }}
          >
            Get Started →
          </button>
        </div>
      </div>

      {/* ── Confidence anchors ───────────────────────────────────────────────── */}
      <div
        style={{
          position     : 'absolute',
          bottom       : '2rem',
          left         : '5vw',
          fontSize     : '10px',
          fontWeight   : 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color        : 'var(--black)',
          opacity      : 0.4,
          zIndex       : 20,
        }}
      >
        Since 2018
      </div>

      <div
        style={{
          position     : 'absolute',
          bottom       : '2rem',
          right        : '5vw',
          fontSize     : '10px',
          fontWeight   : 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color        : 'var(--black)',
          opacity      : 0.4,
          zIndex       : 20,
        }}
      >
        Scroll Down ↓
      </div>
    </section>
  )
}
