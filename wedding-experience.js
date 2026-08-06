/**
 * South Indian Wedding Experience
 * Curtain opening + section reveals
 */

const WX_CONFIG = {
  weddingDate: '2026-09-07T09:00:00+05:30',
  petalColors: ['#FFD6E5', '#FFB6C8', '#FFF0F5', '#E8437A', '#F5E0A8'],
  // Manamaganin Sathiyam — Kanne Kaniye Unnai Kaivida Maaten (Kochadaiiyaan)
  youtubeVideoId: 'R5Wa9J3Whis',
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
  const OPEN_DURATION = 2.8;

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

    tl.to(curtainCta, { opacity: 0, pointerEvents: 'none', duration: 0.3 }, 0);
    animateLoveBurst(loveBurst, tl, 0.15);
    animateBreeze(breezeParticles, tl, 0);
    tl.to(divineLight, { opacity: 1, scale: 1.15, duration: OPEN_DURATION * 0.65, ease: 'power1.out' }, 0.1);

    if (floralArch) {
      tl.fromTo(floralArch, { scale: 1 }, {
        scale: 1.02,
        duration: OPEN_DURATION * 0.4,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1,
      }, 0.2);
    }

    tl.to(left, {
      x: -slide * 0.92,
      rotateY: -38,
      scaleX: 0.45,
      duration: OPEN_DURATION,
      ease: 'power3.inOut',
    }, 0.12);

    tl.to(right, {
      x: slide * 0.92,
      rotateY: 38,
      scaleX: 0.45,
      duration: OPEN_DURATION,
      ease: 'power3.inOut',
    }, 0.12);

    if (bgImg) {
      tl.to(bgImg, { scale: 1, duration: OPEN_DURATION, ease: 'power1.out' }, 0);
    }
    tl.to(stageContent, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      ease: 'back.out(1.4)',
    }, OPEN_DURATION * 0.25);

    tl.to(invitationPortal, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'elastic.out(1, 0.6)',
    }, OPEN_DURATION * 0.3);

    tl.to('.invitation-portal > header, .invitation-portal > .invitation-portal__couple, .invitation-portal > .invitation-portal__dates', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
    }, OPEN_DURATION * 0.38);

    tl.add(() => enterWebsite(), OPEN_DURATION * 0.82);
  }

  function enterWebsite() {
    document.body.classList.remove('is-landing');
    document.body.classList.add('is-entered');
    header?.classList.add('is-visible');
    track.classList.add('is-site-entered');

    siteSweep?.classList.add('is-active');
    setTimeout(() => siteSweep?.classList.remove('is-active'), 1400);

    const stickyEl = document.querySelector('.opening-sticky');

    const enterTl = gsap.timeline({
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });

    enterTl.to(stickyEl, {
      opacity: 0,
      y: -48,
      duration: 0.75,
      ease: 'power2.in',
      onStart: () => stickyEl?.classList.add('is-fading'),
    }, 0);

    enterTl.to(track, {
      height: 0,
      minHeight: 0,
      duration: 0.55,
      ease: 'power2.inOut',
    }, 0.35);

    enterTl.add(() => {
      ScrollTrigger.refresh();
      const target = storySection || document.querySelector('#story');
      if (!target) return;

      gsap.to(window, {
        scrollTo: { y: target, offsetY: 72 },
        duration: 1.25,
        ease: 'power2.inOut',
      });

      gsap.fromTo(target, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
      });
    }, 0.5);
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
      duration: 0.6,
      ease: 'power2.out',
    }, delay);

    tl.to(el, {
      opacity: 0,
      y: y - 60,
      scale: 0.3,
      duration: 1.8,
      ease: 'power1.in',
    }, delay + 0.5);
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
