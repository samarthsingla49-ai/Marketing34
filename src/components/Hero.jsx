import RibbonScene from './RibbonScene'

/*
  DOM Z-INDEX WEAVE
  ─────────────────
  The trick that makes the ribbon appear to weave through the text:

      [z:1 ] "We unlock"      ← canvas (z:5) is IN FRONT  → ribbon overlaps text
      [z:5 ] <canvas>         ← the Three.js ribbon lives here
      [z:15] "[top] marketing talent." ← canvas (z:5) is BEHIND → text on top of ribbon

  No shader magic needed — pure DOM layering creates the Atuin illusion.
*/

export default function Hero () {
  return (
    <section
      id="hero-section"
      style={{
        position      : 'relative',
        isolation     : 'isolate',        // scopes z-index so fixed header (z:500) never bleeds in
        height        : '100vh',
        display       : 'flex',
        flexDirection : 'column',
        justifyContent: 'center',
        overflow      : 'hidden',
        background    : 'var(--white)',
        padding       : '0 6vw',
        paddingTop    : 'clamp(5rem, 10vh, 7rem)',
      }}
    >
      {/* ── 3D Canvas — z-index 5 ───────────────────────────────────────────── */}
      <RibbonScene />

      {/* ── Eyebrow label ───────────────────────────────────────────────────── */}
      <p
        className="hero-line"
        style={{
          position     : 'relative',
          zIndex       : 1,
          fontSize     : '0.65rem',
          fontWeight   : 500,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color        : 'var(--black)',
          opacity      : 0.38,
          marginBottom : '1.6rem',
        }}
      >
        Marketing Recruitment
      </p>

      {/* ── Hero headline ───────────────────────────────────────────────────── */}
      <h1
        style={{
          fontFamily   : 'var(--font-display)',
          fontSize     : 'clamp(3.8rem, 10.5vw, 10rem)',
          fontWeight   : 700,
          lineHeight   : 0.90,
          letterSpacing: '-0.04em',
          color        : 'var(--black)',
          margin       : '0 0 clamp(2.5rem,5vw,5rem)',
          maxWidth     : '95vw',
        }}
      >
        {/*
          LINE 1 — sits BELOW the canvas (z:1).
          The ribbon sweeps IN FRONT of this line.
        */}
        <span
          className="hero-line"
          style={{ display: 'block', position: 'relative', zIndex: 1 }}
        >
          We unlock
        </span>

        {/*
          LINE 2 — sits ABOVE the canvas (z:15).
          The ribbon sweeps BEHIND this line — the weave illusion.

          "[top]" is an italic pill (echoing Atuin's "into").
          "marketing" is a rectangular outlined box (echoing Atuin's "software").
        */}
        <span
          className="hero-line"
          style={{
            display  : 'block',
            position : 'relative',
            zIndex   : 15,
            marginTop: '0.06em',
          }}
        >
          {/* Italic pill ──────────────────────────────────────────────────── */}
          <span
            style={{
              display      : 'inline-flex',
              alignItems   : 'center',
              border       : '2.5px solid var(--black)',
              borderRadius : '999px',
              padding      : '0 0.30em',
              fontStyle    : 'italic',
              fontWeight   : 400,
              height       : '0.86em',
              verticalAlign: 'middle',
              marginRight  : '0.16em',
            }}
          >
            top
          </span>

          {/* Rectangular outlined box ─────────────────────────────────────── */}
          <span
            style={{
              display      : 'inline-block',
              border       : '2.5px solid var(--black)',
              borderRadius : '0.16em',
              padding      : '0.04em 0.28em',
              lineHeight   : 1,
              verticalAlign: 'middle',
            }}
          >
            marketing
          </span>
        </span>

        {/*
          LINE 3 — sits BELOW the canvas again (z:1).
          Ribbon can sweep in front here too.
        */}
        <span
          className="hero-line"
          style={{
            display  : 'block',
            position : 'relative',
            zIndex   : 1,
            marginTop: '0.05em',
          }}
        >
          talent.
        </span>
      </h1>

      {/* ── Sub-copy + CTA ──────────────────────────────────────────────────── */}
      <div
        className="hero-cta-row"
        style={{
          display    : 'flex',
          flexWrap   : 'wrap',
          alignItems : 'center',
          gap        : '2.5rem',
          position   : 'relative',
          zIndex     : 1,
        }}
      >
        <p
          data-reveal
          style={{
            fontFamily: 'var(--font-body)',
            fontSize  : 'clamp(1rem, 1.5vw, 1.4rem)',
            fontWeight: 300,
            lineHeight: 1.55,
            color     : '#666',
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
            whiteSpace   : 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--black)' }}
        >
          Get Started →
        </button>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────────────────── */}
      <div
        style={{
          position     : 'absolute',
          bottom       : '2.2rem',
          right        : '6vw',
          fontSize     : '9px',
          fontWeight   : 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color        : 'var(--black)',
          opacity      : 0.35,
          zIndex       : 20,
          display      : 'flex',
          alignItems   : 'center',
          gap          : '0.6rem',
        }}
      >
        Scroll
        {/* Animated line */}
        <span className="scroll-line" />
      </div>

      {/* ── "Since 2018" confidence anchor ─────────────────────────────────── */}
      <div
        style={{
          position     : 'absolute',
          bottom       : '2.2rem',
          left         : '6vw',
          fontSize     : '9px',
          fontWeight   : 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color        : 'var(--black)',
          opacity      : 0.35,
          zIndex       : 20,
        }}
      >
        Since 2018
      </div>
    </section>
  )
}
