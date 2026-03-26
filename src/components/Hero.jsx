import RibbonScene from './RibbonScene'

/*
  Z-index layering for the weave illusion
  ────────────────────────────────────────
  Canvas (RibbonScene)    → z-index: 5
  "We unlock"  + "talent." → z-index: 1   ribbon paints IN FRONT of these lines
  "[top] marketing"        → z-index: 15  ribbon paints BEHIND this line

  isolation:"isolate" on the section creates a fresh stacking context so
  these z-indices are self-contained and never conflict with the fixed header.
*/

const titleStyle = {
  fontSize     : 'clamp(3.2rem, 10.5vw, 9.5rem)',
  lineHeight   : 0.85,
  fontWeight   : 900,
  letterSpacing: '-0.06em',
  margin       : 0,
}

const lineBehind = {    // ribbon in front
  display : 'block',
  position: 'relative',
  zIndex  : 1,
}

const lineFront = {     // ribbon behind
  display : 'block',
  position: 'relative',
  zIndex  : 15,
}

export default function Hero () {
  return (
    <section
      id="hero-section"
      style={{
        position : 'relative',
        isolation: 'isolate',      // own stacking context — clean z-index scope
        minHeight: '100vh',
        padding  : 'clamp(5rem,8vw,8rem) clamp(2rem,10vw,8rem)',
        display  : 'flex',
        flexDirection : 'column',
        justifyContent: 'center',
        overflow : 'hidden',
      }}
    >
      {/* ── 3-D canvas overlay (z-index 5) ─────────────────────────────── */}
      <RibbonScene />

      {/* ── Hero content ─────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', maxWidth: '80rem' }}>

        {/* Title — three lines at deliberately different z-indices */}
        <h1 style={{ ...titleStyle, marginBottom: '2rem' }}>
          {/* LINE 1 — BEHIND ribbon */}
          <span style={lineBehind}>We unlock</span>

          {/* LINE 2 — IN FRONT of ribbon (ribbon weaves behind this) */}
          <span style={lineFront}>
            <span style={{
              display      : 'inline-flex',
              alignItems   : 'center',
              border       : '0.055em solid #1a1a1a',
              borderRadius : '999px',
              padding      : '0 0.38em',
              margin       : '0 0.08em',
              fontStyle    : 'italic',
              height       : '0.88em',
              verticalAlign: 'middle',
            }}>
              top
            </span>
            {' marketing'}
          </span>

          {/* LINE 3 — BEHIND ribbon */}
          <span style={lineBehind}>talent.</span>
        </h1>

        {/* Sub-row: tagline + CTA */}
        <div style={{
          display       : 'flex',
          flexWrap      : 'wrap',
          alignItems    : 'flex-end',
          justifyContent: 'space-between',
          marginTop     : 'clamp(3rem,6vw,7rem)',
          gap           : '2.5rem',
        }}>
          <p style={{
            fontSize  : 'clamp(1.1rem,1.8vw,1.75rem)',
            maxWidth  : '32rem',
            color     : '#6b7280',
            fontWeight: 500,
            lineHeight: 1.45,
            margin    : 0,
            position  : 'relative',
            zIndex    : 1,
          }}>
            Connect with vetted marketing specialists who deliver results.
            From strategy to execution, find the perfect talent for your
            growth goals.
          </p>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <button
              style={{
                background  : '#0a0a0a',
                color       : '#fff',
                border      : 'none',
                borderRadius: '999px',
                padding     : '1.4rem 3.2rem',
                fontSize    : '1.1rem',
                fontWeight  : 800,
                cursor      : 'pointer',
                letterSpacing: '0.01em',
                transition  : 'transform 0.25s cubic-bezier(.23,1,.32,1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>

      {/* ── Location tag (bottom-left) ────────────────────────────────────── */}
      <div style={{
        position    : 'absolute',
        bottom      : '2.5rem',
        left        : '2.5rem',
        display     : 'flex',
        alignItems  : 'center',
        fontSize    : '0.6rem',
        fontWeight  : 800,
        textTransform: 'uppercase',
        letterSpacing: '0.32em',
        opacity     : 0.22,
        zIndex      : 20,
      }}>
        <span style={{
          width: 10, height: 10,
          background: '#0055ff',
          borderRadius: '50%',
          display: 'inline-block',
          marginRight: '0.8rem',
          flexShrink: 0,
        }} />
        London — Dubai — New York
      </div>

      {/* ── Scroll indicator (bottom-right) ──────────────────────────────── */}
      <div style={{
        position    : 'absolute',
        bottom      : '2.5rem',
        right       : '2.5rem',
        fontSize    : '0.55rem',
        fontWeight  : 800,
        textTransform: 'uppercase',
        letterSpacing: '0.32em',
        opacity     : 0.22,
        zIndex      : 20,
      }}>
        Scroll Down
      </div>
    </section>
  )
}
