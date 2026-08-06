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
   CURTAIN OPENING
   ============================================================ */
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
  const rod = document.getElementById('curtain-rod');
  const thoranam = document.getElementById('curtain-thoranam');
  const wisps = document.querySelectorAll('.curtain-wisp');

  if (!track || !left || !right) return;

  const leftFolds = left.querySelectorAll('.curtain-fold');
  const rightFolds = right.querySelectorAll('.curtain-fold');
  const OPEN_DURATION = 4;
  const PERSPECTIVE = 1400;

  gsap.set(stageContent, { opacity: 0, y: 30, scale: 0.94 });
  gsap.set(scrollHint, { opacity: 0 });
  gsap.set(divineLight, { opacity: 0, scale: 0.7 });
  gsap.set(left, { x: 0 });
  gsap.set(right, { x: 0 });
  gsap.set(wisps, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 0.6 });
  if (bgImg) gsap.set(bgImg, { scale: 1.08 });

  gsap.set(leftFolds, { rotateY: 0, z: 0, skewY: 0, transformPerspective: PERSPECTIVE });
  gsap.set(rightFolds, { rotateY: 0, z: 0, skewY: 0, transformPerspective: PERSPECTIVE });

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
    header?.classList.add('header--wedding', 'is-visible');

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

    tl.to(curtainCta, { opacity: 0, pointerEvents: 'none', duration: 0.35 }, 0);

    tl.to(rod, { y: -24, opacity: 0, duration: 0.9, ease: 'power2.in' }, 0.15);
    tl.to(thoranam, { y: -36, opacity: 0, rotation: -4, duration: 0.9, ease: 'power2.in' }, 0.2);

    leftFolds.forEach((fold, i) => {
      const depth = leftFolds.length - 1 - i;
      tl.to(fold, {
        rotateY: -(48 + depth * 10),
        z: 30 + depth * 22,
        skewY: -2.5 - depth * 0.4,
        duration: OPEN_DURATION * 0.75,
        ease: 'power2.out',
      }, depth * 0.07);
    });

    rightFolds.forEach((fold, i) => {
      const depth = rightFolds.length - 1 - i;
      tl.to(fold, {
        rotateY: 48 + depth * 10,
        z: 30 + depth * 22,
        skewY: 2.5 + depth * 0.4,
        duration: OPEN_DURATION * 0.75,
        ease: 'power2.out',
      }, depth * 0.07);
    });

    tl.to(left, { x: -slide * 0.12, duration: OPEN_DURATION * 0.45, ease: 'power1.out' }, 0.1);
    tl.to(right, { x: slide * 0.12, duration: OPEN_DURATION * 0.45, ease: 'power1.out' }, 0.1);

    tl.to(left, { x: -slide, duration: OPEN_DURATION * 0.55, ease: 'power2.in' }, OPEN_DURATION * 0.42);
    tl.to(right, { x: slide, duration: OPEN_DURATION * 0.55, ease: 'power2.in' }, OPEN_DURATION * 0.42);

    wisps.forEach((wisp, i) => {
      const isLeft = wisp.classList.contains('curtain-wisp--l1') || wisp.classList.contains('curtain-wisp--l2');
      const dir = isLeft ? -1 : 1;
      const delay = OPEN_DURATION * 0.28 + i * 0.12;

      tl.to(wisp, {
        opacity: 0.85,
        scale: 1,
        x: dir * (60 + i * 35),
        y: -20 - i * 18,
        rotation: dir * (18 + i * 8),
        duration: 1.6,
        ease: 'power1.out',
      }, delay);

      tl.to(wisp, {
        opacity: 0,
        y: `-=${40 + i * 20}`,
        rotation: `+=${dir * 12}`,
        duration: 1.4,
        ease: 'power1.in',
      }, delay + 1.2);
    });

    if (bgImg) {
      tl.to(bgImg, { scale: 1, duration: OPEN_DURATION, ease: 'power1.out' }, 0);
    }
    tl.to(divineLight, { opacity: 1, scale: 1, duration: OPEN_DURATION * 0.7 }, 0.2);
    tl.to(stageContent, { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'power2.out' }, OPEN_DURATION * 0.48);
    tl.to(scrollHint, { opacity: 1, duration: 0.4 }, OPEN_DURATION * 0.82);
  }

  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    playCurtainOpen();
  });

  left.addEventListener('click', playCurtainOpen);
  right.addEventListener('click', playCurtainOpen);

  [left, right].forEach((wing) => {
    wing.addEventListener('keydown', (e) => {
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
