import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/* Reveal elements on scroll */
export function revealOnScroll(targets, options = {}) {
  const els = typeof targets === 'string' ? document.querySelectorAll(targets) : targets
  if (!els || els.length === 0) return
  gsap.fromTo(els,
    { opacity: 0, y: options.y ?? 50 },
    {
      opacity: 1, y: 0,
      duration: options.duration ?? 0.9,
      stagger: options.stagger ?? 0.12,
      ease: options.ease ?? 'power3.out',
      scrollTrigger: {
        trigger: options.trigger ?? els[0],
        start: options.start ?? 'top 82%',
        once: true,
        ...options.scrollTrigger
      }
    }
  )
}

/* Counter animation */
export function countUp(el, end, duration = 2) {
  gsap.fromTo({ val: 0 },
    { val: 0 },
    {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate() { if (el) el.textContent = Math.round(this.targets()[0].val) },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    }
  )
}

/* Stagger cards */
export function staggerCards(container, selector = '.card') {
  const els = container.querySelectorAll(selector)
  if (!els.length) return
  gsap.fromTo(els,
    { opacity: 0, y: 40, scale: 0.96 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 78%',
        once: true
      }
    }
  )
}

/* Draw SVG paths */
export function drawPaths(container) {
  const paths = container.querySelectorAll('path, line, polyline')
  paths.forEach(path => {
    const len = path.getTotalLength ? path.getTotalLength() : 200
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
        once: true
      }
    })
  })
}

/* Horizontal marquee */
export function marquee(el, speed = 30) {
  if (!el) return
  const inner = el.querySelector('.marquee-inner')
  if (!inner) return
  const clone = inner.cloneNode(true)
  el.appendChild(clone)
  const totalW = inner.scrollWidth
  gsap.to(el.querySelectorAll('.marquee-inner'), {
    x: -totalW,
    duration: speed,
    ease: 'none',
    repeat: -1
  })
}
