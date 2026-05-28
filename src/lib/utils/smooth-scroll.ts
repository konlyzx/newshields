import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId: number | null = null;
let observer: IntersectionObserver | null = null;

export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Respect reduced motion preference
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    lenis = new Lenis({
      duration: 1.6,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t)),
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4
    });

    const raf = (time: number) => {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Hash-link smooth scroll
    document.addEventListener('click', onAnchorClick, true);
  }

  // Reveal-on-scroll observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer?.observe(el));

  // Re-scan when DOM updates (basic — uses MutationObserver)
  const mo = new MutationObserver(() => {
    document
      .querySelectorAll('.reveal:not(.is-visible)')
      .forEach((el) => observer?.observe(el));
  });
  mo.observe(document.body, { childList: true, subtree: true });

  return () => {
    document.removeEventListener('click', onAnchorClick, true);
    if (rafId != null) cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
    observer?.disconnect();
    observer = null;
    mo.disconnect();
  };
}

function onAnchorClick(e: MouseEvent): void {
  const target = (e.target as HTMLElement | null)?.closest?.('a[href^="#"], a[href*="/#"]');
  if (!target) return;
  const href = (target as HTMLAnchorElement).getAttribute('href');
  if (!href) return;
  const hashIdx = href.indexOf('#');
  if (hashIdx === -1) return;
  const id = href.slice(hashIdx + 1);
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  lenis?.scrollTo(el, { offset: -80, duration: 1.6 });
}

export function getLenis(): Lenis | null {
  return lenis;
}
