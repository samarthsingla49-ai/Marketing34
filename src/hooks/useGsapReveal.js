import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGsapReveal () {
  useEffect(() => {
    // ── Hero lines entrance ──────────────────────────────────────────────────
    gsap.from('.hero-line', {
      y       : 100,
      opacity : 0,
      duration: 1.15,
      stagger : 0.14,
      ease    : 'power3.out',
      delay   : 0.2,
      clearProps: 'transform',
    })

    // ── Scroll-triggered reveal for [data-reveal] elements ───────────────────
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger    : el,
          start      : 'top 84%',
          toggleActions: 'play none none none',
        },
        y       : 50,
        opacity : 0,
        duration: 0.9,
        ease    : 'power2.out',
        clearProps: 'transform',
      })
    })

    // ── Scroll-triggered reveal for [data-reveal-section] ────────────────────
    gsap.utils.toArray('[data-reveal-section]').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger    : el,
          start      : 'top 90%',
          toggleActions: 'play none none none',
        },
        y       : 30,
        opacity : 0,
        duration: 0.8,
        ease    : 'power2.out',
        clearProps: 'transform',
      })
    })
  }, [])
}
