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
   CURTAIN OPENING — magic-show air sweep
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
  const airBlast = document.getElementById('curtain-air-blast');
  const airCore = airBlast?.querySelector('.curtain-scene__air-core');
  const airRings = airBlast?.querySelectorAll('.curtain-scene__air-ring');
  const windContainer = document.getElementById('curtain-wind');
  const blazeContainer = document.getElementById('curtain-blaze');
  const wisps = document.querySelectorAll('.curtain-wisp');

  if (!track || !left || !right) return;

  const leftFolds = left.querySelectorAll('.curtain-fold');
  const rightFolds = right.querySelectorAll('.curtain-fold');
  const OPEN_DURATION = 5;
  const PERSPECTIVE = 1400;

  buildWindStreaks(windContainer);

  gsap.set(stageContent, { opacity: 0, y: 30, scale: 0.94 });
  gsap.set(scrollHint, { opacity: 0 });
  gsap.set(divineLight, { opacity: 0, scale: 0.5 });
  gsap.set(airBlast, { opacity: 0 });
  gsap.set(airCore, { scale: 0.15, opacity: 0 });
  gsap.set(airRings, { scale: 0.1, opacity: 0 });
  gsap.set(left, { x: 0, y: 0, rotateZ: 0, skewY: 0 });
  gsap.set(right, { x: 0, y: 0, rotateZ: 0, skewY: 0 });
  gsap.set(wisps, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 0.5, skewX: 0 });
  if (bgImg) gsap.set(bgImg, { scale: 1.12 });

  gsap.set(leftFolds, { rotateY: 0, rotateX: 0, z: 0, skewY: 0, skewX: 0, y: 0, transformPerspective: PERSPECTIVE });
  gsap.set(rightFolds, { rotateY: 0, rotateX: 0, z: 0, skewY: 0, skewX: 0, y: 0, transformPerspective: PERSPECTIVE });

  function playCurtainOpen() {
    if (curtainsOpened) return;
    curtainsOpened = true;

    if (!bellsPlayed) {
      bellsPlayed = true;
      playTempleBells();
      startAmbientMusic();
    }

    const slide = left.offsetWidth;
    const embers = spawnBlazeEmbers(blazeContainer, 24);

    track.classList.add('is-curtains-open');
    curtains?.classList.add('is-open', 'is-flying');
    header?.classList.add('header--wedding', 'is-visible');

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => curtains?.classList.remove('is-flying'),
    });

    /* —— CTA & header decor fade —— */
    tl.to(curtainCta, { opacity: 0, pointerEvents: 'none', duration: 0.3 }, 0);
    tl.to(rod, { y: -30, opacity: 0, duration: 0.7, ease: 'power2.in' }, 0.1);
    tl.to(thoranam, { y: -40, opacity: 0, rotation: -6, duration: 0.7, ease: 'power2.in' }, 0.12);

    /* —— Air blast erupts from centre (magic reveal) —— */
    tl.to(airBlast, { opacity: 1, duration: 0.12 }, 0);
    tl.to(airCore, {
      scale: 2.8,
      opacity: 0.9,
      duration: 0.55,
      ease: 'expo.out',
    }, 0);
    tl.to(airCore, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.45);

    airRings?.forEach((ring, i) => {
      tl.to(ring, {
        scale: 2.5 + i * 0.8,
        opacity: 0.65 - i * 0.15,
        duration: 1.1 + i * 0.15,
        ease: 'expo.out',
      }, 0.05 + i * 0.08);
      tl.to(ring, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 0.7 + i * 0.1);
    });
    tl.to(airBlast, { opacity: 0, duration: 0.4 }, 1.6);

    /* —— Divine light burst through the gap —— */
    tl.to(divineLight, {
      opacity: 1,
      scale: 1.15,
      duration: OPEN_DURATION * 0.65,
      ease: 'power2.out',
    }, 0.08);
    tl.to(divineLight, { scale: 1, duration: 1.2, ease: 'sine.out' }, OPEN_DURATION * 0.5);

    /* —— Wind streaks whoosh outward —— */
    animateWindBurst(windContainer, tl, 0.05);

    /* —— Golden blaze embers fly —— */
    animateBlazeEmbers(embers, tl, 0.1);

    /* —— Fabric wave: folds ripple from centre, lifted by air —— */
    animateFoldWave(leftFolds, 'left', tl, OPEN_DURATION);
    animateFoldWave(rightFolds, 'right', tl, OPEN_DURATION);

    /* —— Wings sweep outward & upward like magic-show curtains —— */
    tl.to(left, {
      x: -slide * 0.08,
      y: -18,
      rotateZ: -2,
      skewY: -2,
      duration: OPEN_DURATION * 0.22,
      ease: 'power2.out',
    }, 0.12);

    tl.to(right, {
      x: slide * 0.08,
      y: -18,
      rotateZ: 2,
      skewY: 2,
      duration: OPEN_DURATION * 0.22,
      ease: 'power2.out',
    }, 0.12);

    tl.to(left, {
      x: -slide * 0.55,
      y: -55,
      rotateZ: -10,
      skewY: -6,
      duration: OPEN_DURATION * 0.38,
      ease: 'expo.out',
    }, OPEN_DURATION * 0.2);

    tl.to(right, {
      x: slide * 0.55,
      y: -55,
      rotateZ: 10,
      skewY: 6,
      duration: OPEN_DURATION * 0.38,
      ease: 'expo.out',
    }, OPEN_DURATION * 0.2);

    tl.to(left, {
      x: -slide * 1.08,
      y: -35,
      rotateZ: -6,
      skewY: -3,
      duration: OPEN_DURATION * 0.42,
      ease: 'power4.inOut',
    }, OPEN_DURATION * 0.48);

    tl.to(right, {
      x: slide * 1.08,
      y: -35,
      rotateZ: 6,
      skewY: 3,
      duration: OPEN_DURATION * 0.42,
      ease: 'power4.inOut',
    }, OPEN_DURATION * 0.48);

    /* —— Silk wisps torn free and carried by the gust —— */
    wisps.forEach((wisp, i) => {
      const isLeft = wisp.className.includes('--l');
      const dir = isLeft ? -1 : 1;
      const delay = 0.18 + i * 0.09;
      const dist = 90 + i * 55;
      const lift = 40 + i * 35;

      tl.to(wisp, {
        opacity: 0.9,
        scale: 1,
        x: dir * dist * 0.35,
        y: -lift * 0.4,
        rotation: dir * (12 + i * 6),
        skewX: dir * 15,
        duration: 1.1,
        ease: 'power2.out',
      }, delay);

      tl.to(wisp, {
        x: dir * dist,
        y: -lift - 30,
        rotation: dir * (35 + i * 10),
        skewX: dir * 25,
        duration: 1.8,
        ease: 'sine.out',
      }, delay + 0.5);

      tl.to(wisp, {
        opacity: 0,
        y: `-=${50 + i * 20}`,
        duration: 1.2,
        ease: 'power1.in',
      }, delay + 1.6);
    });

    if (bgImg) {
      tl.to(bgImg, { scale: 1, duration: OPEN_DURATION, ease: 'power1.out' }, 0);
    }
    tl.to(stageContent, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.4,
      ease: 'power2.out',
    }, OPEN_DURATION * 0.42);
    tl.to(scrollHint, { opacity: 1, duration: 0.4 }, OPEN_DURATION * 0.78);
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

function buildWindStreaks(container) {
  if (!container || container.childElementCount) return;
  for (let i = 0; i < 14; i++) {
    const line = document.createElement('span');
    const goLeft = i % 2 === 0;
    line.className = `curtain-scene__wind-line ${goLeft ? 'curtain-scene__wind-line--left' : 'curtain-scene__wind-line--right'}`;
    line.style.top = `${12 + (i * 5.8) % 76}%`;
    container.appendChild(line);
  }
}

function animateWindBurst(container, tl, startAt) {
  if (!container) return;
  const lines = container.querySelectorAll('.curtain-scene__wind-line');
  lines.forEach((line, i) => {
    const goLeft = line.classList.contains('curtain-scene__wind-line--left');
    const delay = startAt + (i % 7) * 0.04;

    tl.fromTo(line, {
      scaleX: 0,
      opacity: 0,
      x: 0,
    }, {
      scaleX: 0.6 + (i % 4) * 0.15,
      opacity: 0.85,
      duration: 0.38,
      ease: 'power2.out',
    }, delay);

    tl.to(line, {
      scaleX: 1.1,
      x: goLeft ? '-48vw' : '48vw',
      opacity: 0,
      duration: 1.15 + (i % 4) * 0.1,
      ease: 'power1.out',
    }, delay + 0.12);
  });
}

function spawnBlazeEmbers(container, count) {
  if (!container) return [];
  container.innerHTML = '';
  const embers = [];
  for (let i = 0; i < count; i++) {
    const ember = document.createElement('span');
    const isStreak = i % 3 === 0;
    ember.className = `curtain-scene__ember${isStreak ? ' curtain-scene__ember--streak' : ''}`;
    container.appendChild(ember);
    gsap.set(ember, { xPercent: -50, yPercent: -50 });
    embers.push(ember);
  }
  return embers;
}

function animateBlazeEmbers(embers, tl, startAt) {
  embers.forEach((ember, i) => {
    const angle = (i / embers.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const dist = 120 + Math.random() * 280;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist * 0.6 - 40;
    const delay = startAt + (i % 8) * 0.03;
    const isStreak = ember.classList.contains('curtain-scene__ember--streak');

    tl.fromTo(ember, {
      x: 0,
      y: 0,
      scale: 0.3,
      opacity: 0,
      rotation: 0,
    }, {
      x: dx * 0.4,
      y: dy * 0.4,
      scale: isStreak ? 1.2 : 1,
      opacity: 0.95,
      rotation: (Math.random() - 0.5) * 60,
      duration: 0.5,
      ease: 'power2.out',
    }, delay);

    tl.to(ember, {
      x: dx,
      y: dy,
      opacity: 0,
      rotation: `+=${(Math.random() - 0.5) * 90}`,
      duration: 1.4 + Math.random() * 0.6,
      ease: 'power1.out',
    }, delay + 0.35);
  });
}

function animateFoldWave(folds, side, tl, duration) {
  const sign = side === 'left' ? -1 : 1;

  folds.forEach((fold, i) => {
    const depth = folds.length - 1 - i;
    const wave = Math.sin((i / (folds.length - 1)) * Math.PI) * 10;
    const delay = depth * 0.055;

    tl.to(fold, {
      rotateY: sign * (62 + depth * 12),
      rotateX: 6 + wave * 0.4,
      skewY: sign * (-10 - depth * 1.8),
      skewX: sign * (-5 - wave * 0.2),
      z: 45 + depth * 30,
      y: -25 - depth * 14,
      duration: duration * 0.42,
      ease: 'expo.out',
    }, delay);

    tl.to(fold, {
      rotateY: sign * (38 + depth * 6),
      rotateX: 2,
      skewY: sign * (-4),
      skewX: 0,
      y: -10 - depth * 5,
      duration: duration * 0.35,
      ease: 'sine.inOut',
    }, delay + duration * 0.38);

    tl.to(fold, {
      rotateY: sign * (18 + depth * 3),
      skewY: sign * (-1.5),
      y: 0,
      duration: duration * 0.28,
      ease: 'power2.inOut',
    }, delay + duration * 0.62);
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
