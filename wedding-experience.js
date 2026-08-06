/**
 * South Indian Wedding Experience
 * Curtain opening + section reveals
 */

const WX_CONFIG = {
  weddingDate: '2026-09-07T09:00:00+05:30',
  petalColors: ['#F4C4C8', '#FFD4B8', '#FFF8F0', '#F4D4D4', '#E8D48B'],
};

let audioCtx = null;
let musicGain = null;
let soundMuted = false;
let bellsPlayed = false;
let curtainsOpened = false;

/* ============================================================
   FLAG-WAVE SCREEN OPENING — modern two-side reveal
   ============================================================ */
const FLAG_STRIP_COUNT = 18;

function initScrollCurtain() {
  const track = document.querySelector('.opening-track');
  const left = document.getElementById('curtain-left');
  const right = document.getElementById('curtain-right');
  const curtains = document.getElementById('curtain-doors');
  const divineLight = document.getElementById('divine-light');
  const stageContent = document.getElementById('stage-content');
  const curtainCta = document.getElementById('curtain-cta');
  const scrollHint = document.getElementById('scroll-hint');
  const bgImg = document.getElementById('curtain-bg-img');
  const header = document.getElementById('header');
  const btn = document.getElementById('begin-wedding');
  const breezeContainer = document.getElementById('curtain-breeze');

  if (!track || !left || !right) return;

  buildFlagStrips(left);
  buildFlagStrips(right);
  const breezeParticles = buildBreezeParticles(breezeContainer, 10);

  const leftStrips = left.querySelectorAll('.flag-strip');
  const rightStrips = right.querySelectorAll('.flag-strip');
  const OPEN_DURATION = 3.2;

  gsap.set(stageContent, { opacity: 0, y: 24, scale: 0.96 });
  gsap.set(scrollHint, { opacity: 0 });
  gsap.set(divineLight, { opacity: 0, scale: 0.75 });
  gsap.set(left, { x: 0, rotateY: 0 });
  gsap.set(right, { x: 0, rotateY: 0 });
  gsap.set(breezeParticles, { opacity: 0, x: 0, y: 0 });
  gsap.set('.mandap-board > header, .mandap-board > .mandap-board__couple, .mandap-board > .mandap-board__dates', {
    opacity: 0,
    y: 28,
  });
  if (bgImg) gsap.set(bgImg, { scale: 1.1 });

  function playCurtainOpen() {
    if (curtainsOpened) return;
    curtainsOpened = true;

    if (!bellsPlayed) {
      bellsPlayed = true;
      playTempleBells();
      startAmbientMusic();
    }

    const slide = left.offsetWidth;

    track.classList.add('is-curtains-open');
    curtains?.classList.add('is-open');
    left.classList.add('is-opening');
    right.classList.add('is-opening');
    header?.classList.add('header--wedding', 'is-visible');

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    tl.to(curtainCta, { opacity: 0, pointerEvents: 'none', duration: 0.3 }, 0);
    animateBreeze(breezeParticles, tl, 0);
    tl.to(divineLight, { opacity: 1, scale: 1, duration: OPEN_DURATION * 0.7, ease: 'power1.out' }, 0.15);
    animateFlagOpenWave(leftStrips, 'left', tl, OPEN_DURATION);
    animateFlagOpenWave(rightStrips, 'right', tl, OPEN_DURATION);

    tl.to(left, { x: -slide, rotateY: -18, duration: OPEN_DURATION }, 0.08);
    tl.to(right, { x: slide, rotateY: 18, duration: OPEN_DURATION }, 0.08);

    if (bgImg) {
      tl.to(bgImg, { scale: 1, duration: OPEN_DURATION, ease: 'power1.out' }, 0);
    }
    tl.to(stageContent, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: 'power2.out',
    }, OPEN_DURATION * 0.32);

    tl.to('.mandap-board > header, .mandap-board > .mandap-board__couple, .mandap-board > .mandap-board__dates', {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: 'power2.out',
    }, OPEN_DURATION * 0.38);

    tl.to(scrollHint, { opacity: 1, duration: 0.4 }, OPEN_DURATION * 0.75);
  }

  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    playCurtainOpen();
  });

  left.addEventListener('click', playCurtainOpen);
  right.addEventListener('click', playCurtainOpen);

  [left, right].forEach((panel) => {
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playCurtainOpen();
      }
    });
  });

  window.addEventListener('wheel', (e) => {
    if (!curtainsOpened && e.deltaY > 0) playCurtainOpen();
  }, { passive: true });

  let touchY = 0;
  track.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (!curtainsOpened && touchY - e.changedTouches[0].clientY > 40) playCurtainOpen();
  }, { passive: true });
}

function buildFlagStrips(panel) {
  const fabric = panel.querySelector('.flag-screen__fabric');
  if (!fabric || fabric.childElementCount) return;
  for (let i = 0; i < FLAG_STRIP_COUNT; i++) {
    const strip = document.createElement('span');
    strip.className = 'flag-strip';
    strip.style.setProperty('--i', i);
    fabric.appendChild(strip);
  }
}

function buildBreezeParticles(container, count) {
  if (!container) return [];
  container.innerHTML = '';
  const particles = [];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'screen-reveal__breeze-particle';
    p.style.top = `${20 + (i * 7) % 60}%`;
    container.appendChild(p);
    particles.push(p);
  }
  return particles;
}

function animateBreeze(particles, tl, startAt) {
  particles.forEach((p, i) => {
    const goLeft = i % 2 === 0;
    const delay = startAt + i * 0.05;
    const dist = 120 + (i % 4) * 40;

    tl.fromTo(p, { opacity: 0, scaleX: 0.2, x: 0 }, {
      opacity: 0.7,
      scaleX: 1,
      x: goLeft ? -dist * 0.3 : dist * 0.3,
      duration: 0.5,
      ease: 'power2.out',
    }, delay);

    tl.to(p, {
      x: goLeft ? -dist : dist,
      opacity: 0,
      duration: 1.4,
      ease: 'power1.out',
    }, delay + 0.2);
  });
}

function animateFlagOpenWave(strips, side, tl, duration) {
  const sign = side === 'left' ? -1 : 1;

  strips.forEach((strip, i) => {
    const depth = strips.length - 1 - i;
    const wave = Math.sin((i / (strips.length - 1)) * Math.PI) * 14;
    const delay = depth * 0.04;

    tl.to(strip, {
      rotateY: sign * (18 + wave),
      skewY: sign * (-6 - depth * 0.5),
      z: 20 + depth * 8,
      duration: duration * 0.55,
      ease: 'sine.out',
    }, delay);

    tl.to(strip, {
      rotateY: sign * (8 + wave * 0.3),
      skewY: sign * (-2),
      duration: duration * 0.45,
      ease: 'sine.inOut',
    }, delay + duration * 0.45);
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
   SECTION REVEALS
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
   AMBIENT PETALS
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
