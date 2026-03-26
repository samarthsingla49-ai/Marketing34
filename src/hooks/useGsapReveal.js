import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGsapReveal () {
  useEffect(() => {
    // ── Hero entrance: staggered lines fly up from below ──────────────────
    const ctx = gsap.context(() => {
      gsap.from('.hero-line', {
        y        : 90,
        opacity  : 0,
        duration : 1.1,
        stagger  : 0.13,
        ease     : 'power3.out',
        delay    : 0.25,
        clearProps: 'transform',   // clean up so z-index stacking still works
      })

      // ── Scroll-triggered reveals for any element with data-reveal ─────────
      gsap.utils.toArray('[data-reveal]').forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger      : el,
            start        : 'top 82%',
            toggleActions: 'play none none none',
          },
          y       : 55,
          opacity : 0,
          duration: 0.95,
          ease    : 'power2.out',
          clearProps: 'transform',
        })
      })
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])
}
