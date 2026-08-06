/**
 * South Indian Wedding Experience
 * Curtain opening + section reveals
 */

const WX_CONFIG = {
  weddingDate: '2026-09-07T09:00:00+05:30',
  petalColors: ['#FFD6E5', '#FFB6C8', '#FFF0F5', '#E8437A', '#F5E0A8'],
  youtubeVideoId: 'R5Wa9J3Whis',
  coupleName: 'R. Balaji & S. Lavanya',
  venue: 'Sengunthar Paavadi Panchayat Thirumana Mandapam, Thiruchengode, Tamil Nadu, India',
  calendarEvents: {
    reception: {
      uid: 'balaji-lavanya-reception',
      title: 'Balaji & Lavanya — Reception',
      start: '2026-09-06T19:00:00+05:30',
      end: '2026-09-06T22:00:00+05:30',
      description: 'Evening celebration for the wedding of R. Balaji and S. Lavanya.',
      filename: 'balaji-lavanya-reception.ics',
    },
    muhurtham: {
      uid: 'balaji-lavanya-muhurtham',
      title: 'Balaji & Lavanya — Muhurtham',
      start: '2026-09-07T09:00:00+05:30',
      end: '2026-09-07T10:00:00+05:30',
      description: 'Sacred wedding ceremony — Muhurtham.',
      filename: 'balaji-lavanya-muhurtham.ics',
    },
  },
};

let audioCtx = null;
let soundMuted = false;
let bellsPlayed = false;
let curtainsOpened = false;
let ytPlayer = null;
let ytReady = false;
let youtubeApiLoading = false;

/* ============================================================
   FLORAL ARCH + SHEER CURTAIN OPENING
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
  const btn = document.getElementById('begin-wedding');
  const beginHint = document.getElementById('begin-wedding-hint');
  const breezeContainer = document.getElementById('curtain-breeze');
  const loveBurst = document.getElementById('love-burst');
  const sticky = document.querySelector('.opening-sticky');
  const floralArch = document.getElementById('floral-arch');
  const invitationPortal = document.querySelector('.invitation-portal');
  const siteSweep = document.getElementById('site-enter-sweep');
  const header = document.getElementById('header');
  const storySection = document.getElementById('story');

  if (!track || !left || !right) return;

  const breezeParticles = buildBreezeParticles(breezeContainer, 10);
  const OPEN_DURATION = 1.55;
  const INVITATION_HOLD = 0.35; // brief beat — no long pause before scroll

  gsap.set(stageContent, { opacity: 0, y: 20, scale: 0.97 });
  gsap.set(scrollHint, { opacity: 0 });
  gsap.set(divineLight, { opacity: 0, scale: 0.8 });
  gsap.set(left, { x: 0, rotateY: 0, scaleX: 1 });
  gsap.set(right, { x: 0, rotateY: 0, scaleX: 1 });
  gsap.set(breezeParticles, { opacity: 0, x: 0, y: 0 });
  gsap.set(invitationPortal, { scale: 0.88, opacity: 0 });
  gsap.set('.invitation-portal > header, .invitation-portal > .invitation-portal__couple, .invitation-portal > .invitation-portal__dates', {
    opacity: 0,
    y: 24,
  });
  if (bgImg) gsap.set(bgImg, { scale: 1.08 });

  loadYouTubeAPI();

  function playCurtainOpen() {
    if (curtainsOpened) return;
    curtainsOpened = true;
    document.body.classList.add('is-curtain-opening');

    if (!bellsPlayed) {
      bellsPlayed = true;
      playTempleBells();
      startWeddingMusic();
    }

    const slide = left.offsetWidth;

    track.classList.add('is-curtains-open');
    curtains?.classList.add('is-open');
    left.classList.add('is-opening');
    right.classList.add('is-opening');
    sticky?.classList.add('is-love-opening');

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    const scrollUnlockAt = OPEN_DURATION + INVITATION_HOLD;

    tl.to(curtainCta, { opacity: 0, pointerEvents: 'none', duration: 0.25 }, 0.2);
    animateLoveBurst(loveBurst, tl, 0.08);
    animateBreeze(breezeParticles, tl, 0);
    tl.to(divineLight, { opacity: 0.35, scale: 1.08, duration: OPEN_DURATION * 0.55, ease: 'power1.out' }, 0.05);

    if (floralArch) {
      tl.fromTo(floralArch, { scale: 1 }, {
        scale: 1.02,
        duration: OPEN_DURATION * 0.35,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1,
      }, 0.1);
    }

    tl.to(left, {
      x: -slide * 0.92,
      rotateY: -38,
      scaleX: 0.45,
      duration: OPEN_DURATION,
      ease: 'power3.out',
    }, 0.05);

    tl.to(right, {
      x: slide * 0.92,
      rotateY: 38,
      scaleX: 0.45,
      duration: OPEN_DURATION,
      ease: 'power3.out',
    }, 0.05);

    if (bgImg) {
      tl.to(bgImg, { scale: 1, duration: OPEN_DURATION, ease: 'power1.out' }, 0);
    }
    tl.to(stageContent, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, OPEN_DURATION * 0.2);

    tl.to(invitationPortal, {
      opacity: 1,
      scale: 1,
      duration: 0.55,
      ease: 'back.out(1.35)',
    }, OPEN_DURATION * 0.22);

    tl.to('.invitation-portal > header, .invitation-portal > .invitation-portal__couple, .invitation-portal > .invitation-portal__dates', {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.07,
      ease: 'power2.out',
    }, OPEN_DURATION * 0.28);

    tl.to(scrollHint, { opacity: 1, duration: 0.3 }, scrollUnlockAt - 0.25);

    tl.add(() => showCoupleScrollLayer(), OPEN_DURATION * 0.4);

    tl.add(() => enterWebsite(), scrollUnlockAt);
  }

  function enterWebsite() {
    document.body.classList.remove('is-curtain-opening');
    document.body.classList.remove('is-landing');
    document.body.classList.add('is-entered');
    header?.classList.remove('is-visible');
    track.classList.add('is-site-entered');

    siteSweep?.classList.add('is-active');
    setTimeout(() => siteSweep?.classList.remove('is-active'), 1400);

    ScrollTrigger.refresh();

    const target = storySection || document.querySelector('#story');
    if (!target) return;

    const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY);

    showCoupleScrollLayer();

    gsap.to(window, {
      scrollTo: { y, autoKill: false },
      duration: 0.95,
      ease: 'power2.inOut',
      onComplete: () => ScrollTrigger.refresh(),
    });

    gsap.fromTo(target, { opacity: 0, y: 24 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  }

  function handleBeginClick(e) {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    if (curtainsOpened) return;

    if (btn) {
      btn.classList.add('is-pressed');
      setTimeout(() => btn.classList.remove('is-pressed'), 450);
    }

    playCurtainOpen();
  }

  btn?.addEventListener('click', handleBeginClick);
  beginHint?.addEventListener('click', handleBeginClick);

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

function animateLoveBurst(container, tl, startAt) {
  if (!container) return;

  const hearts = ['♥', '♡', '❤'];
  const particleCount = window.innerWidth < 768 ? 18 : 28;

  for (let i = 0; i < particleCount; i++) {
    const isHeart = i % 3 !== 0;
    const el = document.createElement('span');
    el.className = `love-burst__particle love-burst__particle--${isHeart ? 'heart' : 'petal'}`;
    if (isHeart) el.textContent = hearts[i % hearts.length];
    container.appendChild(el);

    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist = 120 + Math.random() * 280;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist * 0.7 - 40;
    const rot = (Math.random() - 0.5) * 360;
    const delay = startAt + Math.random() * 0.25;

    tl.fromTo(el, {
      opacity: 0,
      x: 0,
      y: 0,
      scale: 0.2,
      rotation: 0,
    }, {
      opacity: 1,
      x,
      y,
      scale: 0.8 + Math.random() * 0.6,
      rotation: rot,
      duration: 0.45,
      ease: 'power2.out',
    }, delay);

    tl.to(el, {
      opacity: 0,
      y: y - 60,
      scale: 0.3,
      duration: 1.1,
      ease: 'power1.in',
    }, delay + 0.35);
  }

  const ring = document.createElement('span');
  ring.className = 'love-burst__ring';
  container.appendChild(ring);

  tl.fromTo(ring, { opacity: 0, scale: 0.3 }, {
    opacity: 0.9,
    scale: 2.5,
    duration: 1.2,
    ease: 'power2.out',
  }, startAt);

  tl.to(ring, {
    opacity: 0,
    scale: 4,
    duration: 1.4,
    ease: 'power1.in',
  }, startAt + 0.6);
}

/* ============================================================
   AUDIO — Kochadaiiyaan song via YouTube
   ============================================================ */
function loadYouTubeAPI() {
  if (ytPlayer || youtubeApiLoading) return;
  youtubeApiLoading = true;

  if (window.YT?.Player) {
    initYouTubePlayer();
    return;
  }

  const existing = document.getElementById('youtube-iframe-api');
  if (!existing) {
    const tag = document.createElement('script');
    tag.id = 'youtube-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }

  const previousReady = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    if (typeof previousReady === 'function') previousReady();
    initYouTubePlayer();
  };
}

function initYouTubePlayer() {
  if (ytPlayer || !document.getElementById('youtube-player')) return;

  ytPlayer = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    videoId: WX_CONFIG.youtubeVideoId,
    playerVars: {
      autoplay: 0,
      loop: 1,
      playlist: WX_CONFIG.youtubeVideoId,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
    events: {
      onReady: () => { ytReady = true; },
    },
  });
}

function startWeddingMusic() {
  if (soundMuted) return;

  const play = () => {
    if (!ytPlayer?.playVideo) return false;
    ytPlayer.setVolume(75);
    ytPlayer.playVideo();
    return true;
  };

  if (ytReady && play()) return;

  let attempts = 0;
  const waitForPlayer = setInterval(() => {
    attempts += 1;
    if (ytReady && play()) {
      clearInterval(waitForPlayer);
    } else if (attempts > 40) {
      clearInterval(waitForPlayer);
    }
  }, 250);
}

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

function initSoundToggle() {
  const toggle = document.getElementById('sound-toggle');
  if (!toggle) return;
  toggle.classList.add('sound-toggle--wedding');
  toggle.addEventListener('click', () => {
    soundMuted = !soundMuted;
    toggle.classList.toggle('muted', soundMuted);
    if (ytPlayer?.pauseVideo && ytPlayer?.playVideo) {
      if (soundMuted) ytPlayer.pauseVideo();
      else ytPlayer.playVideo();
    }
  });
}

/* ============================================================
   CINEMATIC SCROLL ANIMATIONS — grasp text, multi-direction reveals
   ============================================================ */

const WX_BLOCK_MOTIONS = [
  { x: -100, y: 24, opacity: 0, rotation: -7, scale: 0.94 },
  { x: 100, y: 24, opacity: 0, rotation: 7, scale: 0.94 },
  { x: 0, y: 80, opacity: 0, scale: 0.9 },
  { x: 0, y: -70, opacity: 0, scale: 1.04 },
  { x: -70, y: -50, opacity: 0, skewX: 8 },
  { x: 70, y: 50, opacity: 0, skewX: -8 },
  { x: -50, y: 60, opacity: 0, rotation: 4 },
  { x: 50, y: -40, opacity: 0, rotation: -4 },
];

const WX_WORD_MOTIONS = [
  { y: 48, x: -20, opacity: 0, rotation: -10 },
  { y: -36, x: 24, opacity: 0, rotation: 8 },
  { x: -56, y: 12, opacity: 0, rotation: -6 },
  { x: 56, y: -8, opacity: 0, rotation: 6 },
  { y: 40, x: 40, opacity: 0, scale: 0.6 },
  { y: -32, x: -36, opacity: 0, scale: 1.2 },
];

function motionReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function wrapGraspWords(el) {
  if (!el || el.dataset.wxGrasped || el.closest('.opening-track')) return null;
  const raw = el.textContent.trim();
  if (!raw) return null;

  el.dataset.wxGrasped = '1';
  el.setAttribute('aria-label', raw);
  const words = raw.split(/\s+/);
  el.textContent = '';

  const inners = [];
  words.forEach((word, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'wx-grasp-word';
    const inner = document.createElement('span');
    inner.className = 'wx-grasp-word-inner';
    inner.textContent = word;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    inners.push(inner);
  });

  return inners;
}

function animateGraspWords(el, trigger, delay = 0) {
  const inners = wrapGraspWords(el);
  if (!inners?.length) return;

  gsap.set(inners, { display: 'inline-block', willChange: 'transform, opacity' });

  gsap.from(inners, {
    scrollTrigger: {
      trigger: trigger || el,
      start: 'top 86%',
      toggleActions: 'play none none none',
      once: true,
    },
    delay,
    duration: 0.82,
    stagger: 0.07,
    ease: 'power3.out',
    y: (i) => WX_WORD_MOTIONS[i % WX_WORD_MOTIONS.length].y ?? 0,
    x: (i) => WX_WORD_MOTIONS[i % WX_WORD_MOTIONS.length].x ?? 0,
    opacity: 0,
    rotation: (i) => WX_WORD_MOTIONS[i % WX_WORD_MOTIONS.length].rotation ?? 0,
    scale: (i) => WX_WORD_MOTIONS[i % WX_WORD_MOTIONS.length].scale ?? 1,
  });
}

function animateBlinkReveal(el, trigger) {
  if (!el) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger || el,
      start: 'top 88%',
      toggleActions: 'play none none none',
      once: true,
    },
  });
  tl.from(el, { opacity: 0, scale: 0.4, duration: 0.25, ease: 'back.out(2)' })
    .to(el, { opacity: 0.25, duration: 0.08, repeat: 3, yoyo: true, ease: 'power1.inOut' })
    .to(el, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
}

function initSectionSweeps() {
  document.querySelectorAll('.wx-section[data-transition]').forEach((section) => {
    const type = section.dataset.transition || 'petals';
    const sweep = document.createElement('div');
    sweep.className = `wx-section-sweep wx-section-sweep--${type}`;
    sweep.setAttribute('aria-hidden', 'true');
    section.prepend(sweep);

    gsap.fromTo(
      sweep,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 1.1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none',
          once: true,
        },
      },
    );

    gsap.to(sweep, {
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true,
      },
    });
  });
}

function initRevealBlocks() {
  document.querySelectorAll('.wx-reveal').forEach((el, i) => {
    const motion = WX_BLOCK_MOTIONS[i % WX_BLOCK_MOTIONS.length];
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true,
      },
      duration: 0.95,
      ease: 'power3.out',
      ...motion,
    });
  });
}

function initGraspTextAnimations() {
  const headingSelectors = [
    '.wedding-main .wx-header__title',
    '.wx-rsvp__title',
    '.wx-venue__journey-title',
    '.wx-family-portrait__name',
    '.wx-story__signature',
    '.wx-cal-event__title',
    '.wx-venue__mandapam-name',
  ];

  headingSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => animateGraspWords(el));
  });

  const subtitleSelectors = [
    '.wedding-main .wx-header__subtitle',
    '.wx-venue__journey-route',
    '.wx-rsvp__blessing',
    '.wx-rsvp__blessing-line',
    '.wx-countdown-frame__caption',
    '.wx-story__text p',
    '.wx-family-portrait__parents p',
    '.wx-venue__mandapam-address',
    '.wx-venue__map-caption span',
    '.wx-cal-event__detail',
  ];

  subtitleSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, idx) => {
      animateGraspWords(el, el.closest('.wx-section') || el, idx * 0.05);
    });
  });
}

function initBlinkAccents() {
  document.querySelectorAll('.wx-ornament-icon').forEach((el, i) => {
    animateBlinkReveal(el, el.closest('.wx-header') || el);
    gsap.to(el, {
      scrollTrigger: {
        trigger: el.closest('.wx-section') || el,
        start: 'top 75%',
        toggleActions: 'play none none none',
        once: true,
      },
      y: -4,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.15,
    });
  });

  document.querySelectorAll('.wx-countdown__number').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: '#countdown-timer',
        start: 'top 85%',
        once: true,
      },
      opacity: 0,
      scale: 0.3,
      duration: 0.5,
      stagger: 0.12,
      ease: 'back.out(2.5)',
    });
    gsap.to(el, {
      scrollTrigger: {
        trigger: '#countdown-timer',
        start: 'top 85%',
        once: true,
      },
      opacity: 0.55,
      duration: 0.12,
      repeat: 4,
      yoyo: true,
      delay: 0.6,
      stagger: 0.08,
      ease: 'power1.inOut',
    });
  });

  animateBlinkReveal(document.querySelector('.wx-family__union-heart'), '.wx-family__union');
}

function initIllustratedMapMotion() {
  const map = document.querySelector('.wx-venue__illustrated-map');
  if (!map) return;

  const route = document.getElementById('wxMapRoutePath');
  const landmarks = map.querySelectorAll('.wx-map-landmark, .wx-map-mountain, .wx-map-temple, .wx-map-mandapam');
  const heart = map.querySelector('.wx-map-heart-marker');

  gsap.from(map, {
    scrollTrigger: {
      trigger: '.wx-venue__map-canvas',
      start: 'top 85%',
      once: true,
    },
    opacity: 0,
    y: 50,
    rotation: -3,
    scale: 0.92,
    duration: 1.1,
    ease: 'power3.out',
  });

  if (route) {
    const len = route.getTotalLength();
    gsap.set(route, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(route, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.wx-venue__map-canvas',
        start: 'top 80%',
        once: true,
      },
    });
  }

  gsap.from(landmarks, {
    scrollTrigger: {
      trigger: '.wx-venue__map-canvas',
      start: 'top 80%',
      once: true,
    },
    opacity: 0,
    y: 30,
    x: (i) => (i % 2 === 0 ? -40 : 40),
    stagger: 0.15,
    duration: 0.8,
    ease: 'back.out(1.6)',
  });

  if (heart) {
    animateBlinkReveal(heart.querySelector('.wx-map-heart-ring') || heart, '.wx-venue__map-canvas');
    gsap.to(heart, {
      y: -6,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  gsap.from('.wx-venue__map-live-link', {
    scrollTrigger: {
      trigger: '.wx-venue__map-canvas',
      start: 'top 78%',
      once: true,
    },
    opacity: 0,
    x: 60,
    duration: 0.7,
    delay: 0.8,
    ease: 'power3.out',
  });
}

function initSectionReveals() {
  if (motionReduced()) {
    gsap.set('.wx-reveal, .wx-grasp-word-inner', { opacity: 1, clearProps: 'all' });
    return;
  }

  initSectionSweeps();
  initRevealBlocks();
  initGraspTextAnimations();
  initBlinkAccents();
  initIllustratedMapMotion();
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
function flipCountdownDigit(el, newText) {
  if (!el || el.textContent === newText) return;
  gsap.timeline()
    .to(el, { y: -14, opacity: 0, rotationX: -40, duration: 0.22, ease: 'power2.in', transformPerspective: 400 })
    .call(() => { el.textContent = newText; })
    .fromTo(el, { y: 14, opacity: 0, rotationX: 40 }, { y: 0, opacity: 1, rotationX: 0, duration: 0.38, ease: 'power3.out' });
}

const RSVP_MANTRAS = [
  'வாழ்த்துக்கள் · With Blessings',
  'உங்கள் வாழ்த்துக்கள் எங்கள் ஆசை',
  'சுப முகூர்த்தம் வருகிறது',
  'கல்யாண நாள் நெருங்குகிறது',
  'நல்ல தினம் வருகிறது',
];

function initRsvpMantraCycle() {
  const el = document.getElementById('rsvp-mantra-text');
  if (!el || motionReduced()) return;

  let index = 0;
  setInterval(() => {
    index = (index + 1) % RSVP_MANTRAS.length;
    const next = RSVP_MANTRAS[index];
    gsap.timeline()
      .to(el, { y: -18, opacity: 0, filter: 'blur(4px)', duration: 0.35, ease: 'power2.in' })
      .call(() => { el.textContent = next; })
      .fromTo(el, { y: 18, opacity: 0, filter: 'blur(4px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' });
  }, 3800);
}

function initRsvpScrollChoreography() {
  const section = document.getElementById('rsvp');
  if (!section || motionReduced()) return;

  gsap.from('.wx-countdown__heart', {
    scrollTrigger: {
      trigger: '#countdown-timer',
      start: 'top 88%',
      once: true,
    },
    opacity: 0,
    scale: 0.3,
    y: (i) => (i % 2 === 0 ? 40 : -30),
    x: (i) => (i % 2 === 0 ? -50 : 50),
    rotation: (i) => (i % 2 === 0 ? -12 : 12),
    duration: 0.85,
    stagger: 0.15,
    ease: 'back.out(1.8)',
  });

  gsap.from('.wx-countdown-frame__corner', {
    scrollTrigger: {
      trigger: '.wx-countdown-frame',
      start: 'top 88%',
      once: true,
    },
    scale: 0,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(2)',
  });

  gsap.from('.wx-rsvp__blessing-line', {
    scrollTrigger: {
      trigger: '.wx-rsvp__blessing-block',
      start: 'top 88%',
      once: true,
    },
    opacity: 0,
    x: (i) => (i === 0 ? -60 : 60),
    duration: 0.9,
    stagger: 0.2,
    ease: 'power3.out',
  });
}

function initCountdown() {
  const target = new Date(WX_CONFIG.weddingDate).getTime();
  const ids = ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'];

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) flipCountdownDigit(el, '00');
      });
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
      if (el) flipCountdownDigit(el, pad(values[i]));
    });
  }

  update();
  setInterval(update, 1000);
}

/* ============================================================
   BOTTOM SCROLL AVATARS — fixed corners, join on scroll
   ============================================================ */
let coupleScrollReady = false;

function showCoupleScrollLayer() {
  const layer = document.getElementById('couple-scroll-layer');
  if (!layer) return;

  layer.hidden = false;
  layer.removeAttribute('hidden');
  layer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('has-scroll-avatars');

  if (!coupleScrollReady) {
    coupleScrollReady = true;
    initCoupleScrollAvatars();
  }

  ScrollTrigger.refresh();
}

function initCoupleScrollAvatars() {
  const groom = document.getElementById('couple-scroll-groom');
  const bride = document.getElementById('couple-scroll-bride');
  const thanks = document.getElementById('couple-scroll-thanks');
  const main = document.getElementById('wedding-main');
  if (!groom || !bride || !thanks || !main) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getJoinTravel = () => {
    const w = window.innerWidth;
    const bw = bride.offsetWidth;
    const gw = groom.offsetWidth;
    const overlap = 2;
    return {
      bride: Math.max(0, w / 2 - bw + overlap),
      groom: Math.max(0, w / 2 - gw + overlap),
    };
  };

  const apply = (progress) => {
    const { bride: maxBride, groom: maxGroom } = getJoinTravel();
    const brideTravel = maxBride * progress;
    const groomTravel = maxGroom * progress;
    bride.style.transform = `translate3d(${brideTravel}px, 0, 0)`;
    groom.style.transform = `translate3d(${-groomTravel}px, 0, 0)`;

    const avatarHeight = Math.max(bride.offsetHeight, groom.offsetHeight);
    thanks.style.bottom = `${avatarHeight + 4}px`;

    // Thank-you only when avatars have joined at scroll end, sitting on top of them
    const thanksStart = 0.97;
    const thanksOpacity = progress >= thanksStart
      ? Math.min(1, (progress - thanksStart) / (1 - thanksStart))
      : 0;
    thanks.style.opacity = String(thanksOpacity);
    thanks.style.transform = `translate3d(-50%, ${thanksOpacity > 0 ? '-4px' : '0'}, 0)`;
  };

  if (reducedMotion) {
    apply(1);
    return;
  }

  ScrollTrigger.create({
    trigger: main,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.2,
    invalidateOnRefresh: true,
    onUpdate: (self) => apply(self.progress),
  });

  const maxScroll = ScrollTrigger.maxScroll(window);
  apply(maxScroll > 0 ? window.scrollY / maxScroll : 0);
}

/* ============================================================
   NAV
   ============================================================ */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

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

function padICS(n) {
  return String(n).padStart(2, '0');
}

function toICSStamp(date) {
  const d = new Date(date);
  return `${d.getFullYear()}${padICS(d.getMonth() + 1)}${padICS(d.getDate())}T${padICS(d.getHours())}${padICS(d.getMinutes())}00`;
}

function escapeICS(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function downloadICS(filename, body) {
  const blob = new Blob([body], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildSingleEventICS(event) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Balaji Lavanya Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.uid}@marriageweb`,
    `DTSTAMP:${toICSStamp(new Date())}`,
    `DTSTART:${toICSStamp(event.start)}`,
    `DTEND:${toICSStamp(event.end)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(WX_CONFIG.venue)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

function showInviteToast(message) {
  let toast = document.getElementById('wx-invite-toast');
  if (!toast) {
    toast = document.createElement('p');
    toast.id = 'wx-invite-toast';
    toast.className = 'wx-invite-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showInviteToast._timer);
  showInviteToast._timer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function shareInvitation() {
  const url = window.location.href.split('#')[0];
  const text = `You're invited! ${WX_CONFIG.coupleName} — September 06–07, 2026. ${WX_CONFIG.venue}`;

  if (navigator.share) {
    navigator.share({
      title: `${WX_CONFIG.coupleName} Wedding Invitation`,
      text,
      url,
    }).catch(() => {});
    return;
  }

  const payload = `${text}\n${url}`;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(payload).then(() => showInviteToast('Invitation link copied!')).catch(() => {
      showInviteToast('Copy this link to share the invitation.');
    });
  } else {
    showInviteToast('Copy this link to share the invitation.');
  }
}

function initCalendarAndShare() {
  document.querySelectorAll('[data-calendar-event]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-calendar-event');
      const event = WX_CONFIG.calendarEvents[key];
      if (!event) return;
      downloadICS(event.filename, buildSingleEventICS(event));
    });
  });

  document.querySelector('[data-action="share-invite"]')?.addEventListener('click', shareInvitation);
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
  initRsvpMantraCycle();
  initRsvpScrollChoreography();
  initCalendarAndShare();
  if (document.body.classList.contains('is-entered')) showCoupleScrollLayer();
});
