/**
 * South Indian Wedding Experience — Optimized
 * Native scroll + GSAP ScrollTrigger (no Lenis)
 */

const WX_CONFIG = {
  weddingDate: '2026-09-07T09:00:00+05:30',
  petalColors: ['#F4C4C8', '#FFD4B8', '#FFF8F0', '#F4D4D4', '#E8D48B'],
};

let audioCtx = null;
let musicGain = null;
let soundMuted = false;
let bellsPlayed = false;

/* ============================================================
   SCROLL-DRIVEN CURTAIN OPENING
   ============================================================ */
function initScrollCurtain() {
  const track = document.querySelector('.opening-track');
  const drapeLeft = document.getElementById('door-left');
  const drapeRight = document.getElementById('door-right');
  const portal = document.getElementById('mandap-portal');
  const sparkles = document.getElementById('mandap-sparkles');
  const banner = document.getElementById('royal-banner');
  const seal = document.getElementById('gate-seal');
  const gate = document.getElementById('temple-gate');
  const bgImg = document.getElementById('mandap-bg-img');
  const openingCta = document.getElementById('opening-cta');
  const scrollHint = document.getElementById('scroll-hint');
  const thoranam = document.getElementById('gate-thoranam');
  const lotusBloom = document.getElementById('lotus-bloom');
  const deepam = document.getElementById('gate-deepam');
  const kolamRings = document.querySelectorAll('.kolam-ring, .kolam-spoke');
  const petals = document.querySelectorAll('.lotus-petal');
  const header = document.getElementById('header');
  const btn = document.getElementById('begin-wedding');

  if (!track || !drapeLeft || !drapeRight) return;

  gsap.set(banner, { opacity: 0, scale: 0.88, y: 50 });
  gsap.set(scrollHint, { opacity: 0 });
  gsap.set(sparkles, { opacity: 0 });
  gsap.set(kolamRings, { strokeDashoffset: 1200 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
      onUpdate: (self) => {
        if (self.progress > 0.05 && !bellsPlayed) {
          bellsPlayed = true;
          playTempleBells();
          startAmbientMusic();
        }
        if (self.progress > 0.22) {
          header?.classList.add('header--wedding', 'is-visible');
        }
      },
    },
  });

  tl.to(openingCta, { opacity: 0, y: 25, duration: 0.1 }, 0)
    .to(seal, { opacity: 0, scale: 1.4, duration: 0.18 }, 0.02)
    .to(kolamRings, { strokeDashoffset: 0, duration: 0.35, stagger: 0.04 }, 0.04)
    .to(petals, { scaleY: 1, duration: 0.4, stagger: 0.03, ease: 'power2.out' }, 0.08)
    .to(deepam, { scale: 1.3, duration: 0.25 }, 0.2)
    .to(portal, { opacity: 1, scale: 1, duration: 0.35 }, 0.12)
    .to(drapeLeft, { xPercent: -102, duration: 0.45, ease: 'power2.inOut' }, 0.15)
    .to(drapeRight, { xPercent: 102, duration: 0.45, ease: 'power2.inOut' }, 0.15)
    .to(bgImg, { scale: 1, duration: 0.5 }, 0.15)
    .to(thoranam, { y: -50, opacity: 0, duration: 0.2 }, 0.2)
    .to(lotusBloom, { scale: 1.15, opacity: 0, duration: 0.3 }, 0.4)
    .to(sparkles, { opacity: 0.7, duration: 0.25 }, 0.35)
    .to(gate, { opacity: 0, duration: 0.3 }, 0.48)
    .to(banner, { opacity: 1, scale: 1, y: 0, duration: 0.42, ease: 'power2.out' }, 0.52)
    .to(scrollHint, { opacity: 1, duration: 0.15 }, 0.78);

  btn?.addEventListener('click', () => {
    const endY = track.offsetTop + track.offsetHeight - window.innerHeight;
    gsap.to(window, {
      scrollTo: { y: endY, autoKill: true },
      duration: 1.6,
      ease: 'power2.inOut',
    });
  });
}

/* ============================================================
   AUDIO
   ============================================================ */
function playTempleBells() {
  if (soundMuted) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [520, 780, 1040].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.07 / (i + 1), now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + 3);
    });
  } catch { /* unavailable */ }
}

function startAmbientMusic() {
  if (soundMuted || musicGain) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    musicGain = audioCtx.createGain();
    musicGain.gain.setValueAtTime(0, audioCtx.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 2);
    musicGain.connect(audioCtx.destination);
    [220, 330].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.012 / (i + 1);
      osc.connect(gain);
      gain.connect(musicGain);
      osc.start();
    });
  } catch { /* unavailable */ }
}

function initSoundToggle() {
  const toggle = document.getElementById('sound-toggle');
  if (!toggle) return;
  toggle.classList.add('sound-toggle--wedding');
  toggle.addEventListener('click', () => {
    soundMuted = !soundMuted;
    toggle.classList.toggle('muted', soundMuted);
    if (musicGain) {
      musicGain.gain.setValueAtTime(soundMuted ? 0 : 0.03, audioCtx.currentTime);
    }
  });
}

/* ============================================================
   SECTION REVEALS (lightweight)
   ============================================================ */
function initSectionReveals() {
  document.querySelectorAll('.wx-reveal').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true,
      },
    });
  });
}

/* ============================================================
   AMBIENT PETALS (reduced)
   ============================================================ */
function initAmbientPetals() {
  const container = document.getElementById('ambient-petals');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = window.innerWidth < 768 ? 4 : 8;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'ambient-petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${12 + Math.random() * 10}s`;
    petal.style.animationDelay = `${Math.random() * 8}s`;
    const size = 5 + Math.random() * 6;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.background = WX_CONFIG.petalColors[i % WX_CONFIG.petalColors.length];
    container.appendChild(petal);
  }
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
function initCountdown() {
  const target = new Date(WX_CONFIG.weddingDate).getTime();
  const ids = ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'];

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      ids.forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = '00'; });
      return;
    }
    const values = [
      Math.floor(diff / 86400000),
      Math.floor((diff % 86400000) / 3600000),
      Math.floor((diff % 3600000) / 60000),
      Math.floor((diff % 60000) / 1000),
    ];
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad(values[i]);
    });
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   NAV
   ============================================================ */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const header = document.getElementById('header');

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu?.classList.remove('open');
      toggle?.classList.remove('active');
    });
  });

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, { scrollTo: { y: target, offsetY: 72 }, duration: 0.8, ease: 'power2.inOut' });
    });
  });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  initScrollCurtain();
  initSectionReveals();
  initAmbientPetals();
  initSoundToggle();
  initNav();
  initSmoothAnchors();
  initCountdown();
});
