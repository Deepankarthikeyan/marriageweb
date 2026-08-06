/**
 * Premium Hindu Wedding Invitation — script.js
 * Pure vanilla JavaScript — no frameworks
 */

/* ============================================================
   CONFIGURATION — Edit these values to customize
   ============================================================ */
const CONFIG = {
  // Wedding countdown target (ISO format with timezone)
  weddingDate: '2026-09-07T09:00:00+05:30',

  // Floating petal settings
  petalCount: 18,
  petalColors: ['#F4D4D4', '#D4847C', '#E8D48B', '#F4C4C4', '#FFD4B8'],
};

/* ============================================================
   1. FLOATING FLOWER PETALS
   ============================================================ */
(function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;

  for (let i = 0; i < CONFIG.petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${8 + Math.random() * 12}s`;
    petal.style.animationDelay = `${Math.random() * 10}s`;
    const size = 6 + Math.random() * 10;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.background = CONFIG.petalColors[Math.floor(Math.random() * CONFIG.petalColors.length)];
    container.appendChild(petal);
  }
})();

/* ============================================================
   2. SCROLL REVEAL ANIMATIONS
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ============================================================
   3. SILK CURTAIN TEMPLE REVEAL — scroll-driven cinematic opening
   ============================================================ */
(function initCurtainReveal() {
  const hero = document.getElementById('hero');
  const curtainLeft = document.getElementById('curtain-left');
  const curtainRight = document.getElementById('curtain-right');
  const curtainLayer = document.getElementById('curtain-layer');
  const lightSlit = document.getElementById('curtain-light-slit');
  const lightBurst = document.getElementById('curtain-light-burst');
  const warmGlow = document.getElementById('curtain-warm-glow');
  const rays = document.getElementById('curtain-rays');
  const templeBg = document.getElementById('curtain-temple-bg');
  const stage = document.getElementById('curtain-stage');
  const incense = document.getElementById('curtain-incense');
  const content = document.getElementById('curtain-content');
  const nameGroom = document.getElementById('name-groom');
  const nameBride = document.getElementById('name-bride');
  const bells = document.getElementById('curtain-bells');
  const petalsContainer = document.getElementById('curtain-petals');
  const particlesContainer = document.getElementById('curtain-particles');
  const scrollHint = document.getElementById('scroll-hint');
  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  const soundToggle = document.getElementById('sound-toggle');

  if (!hero || !curtainLeft || !curtainRight) return;

  header?.classList.add('header--temple');

  let bellPlayed = false;
  let soundMuted = false;
  let audioCtx = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  function playTempleBell() {
    if (soundMuted || bellPlayed) return;
    bellPlayed = true;

    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      [520, 780, 1040].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.55, now + 3);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1 / (i + 1), now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 3.5);
      });
    } catch {
      /* Audio not available */
    }
  }

  soundToggle?.addEventListener('click', () => {
    soundMuted = !soundMuted;
    soundToggle.classList.toggle('muted', soundMuted);
    if (!soundMuted) bellPlayed = false;
  });

  /* Floating jasmine & rose petals */
  const petalColors = ['#F4D4D4', '#E8D48B', '#FFD4B8', '#D4847C', '#FFF8F0'];
  const heroPetals = [];
  if (petalsContainer) {
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement('div');
      petal.className = 'curtain-hero__petal';
      petal.style.left = `${40 + Math.random() * 20}%`;
      petal.style.top = `${30 + Math.random() * 40}%`;
      petal.style.animationDuration = `${5 + Math.random() * 7}s`;
      petal.style.animationDelay = `${Math.random() * 4}s`;
      petal.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 120}px`);
      const size = 7 + Math.random() * 10;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
      petalsContainer.appendChild(petal);
      heroPetals.push(petal);
    }
  }

  /* Golden light particles */
  const particles = [];
  if (particlesContainer) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'curtain-hero__particle';
      const size = 2 + Math.random() * 5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${35 + Math.random() * 30}%`;
      p.style.top = `${25 + Math.random() * 50}%`;
      p.style.animationDelay = `${Math.random() * 4}s`;
      p.style.animationDuration = `${3 + Math.random() * 4}s`;
      p.style.opacity = '0';
      particlesContainer.appendChild(p);
      particles.push(p);
    }
  }

  function update() {
    const track = hero.querySelector('.curtain-hero__track');
    const rect = track.getBoundingClientRect();
    const scrollRange = window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const rawProgress = Math.min(1, scrolled / scrollRange);
    const progress = easeInOutQuart(rawProgress);
    const reveal = easeOutCubic(rawProgress);

    /* Curtain splits from center — scroll-synced */
    const slide = reveal * 54;
    const sway = Math.sin(reveal * Math.PI) * 3;
    curtainLeft.style.transform = `translateX(-${slide}vw) rotateY(${sway}deg)`;
    curtainRight.style.transform = `translateX(${slide}vw) rotateY(-${sway}deg)`;

    /* Golden light escapes through the parting */
    const slitWidth = Math.min(18, reveal * 22);
    if (lightSlit) {
      lightSlit.style.width = `${slitWidth}vw`;
      lightSlit.style.opacity = String(Math.min(1, reveal * 2.5));
    }
    if (lightBurst) {
      lightBurst.style.opacity = String(reveal * 0.85);
      lightBurst.style.transform = `translate(-50%, -50%) scale(${0.5 + reveal * 0.8})`;
    }

    if (rawProgress > 0.03) playTempleBell();

    /* Temple bells swing as curtain opens */
    if (bells) {
      const swing = Math.sin(reveal * Math.PI * 3) * 18 * reveal;
      bells.style.transform = `rotate(${swing}deg)`;
      bells.querySelectorAll('.curtain-hero__bell').forEach((bell, i) => {
        const offset = (i - 1) * 8 * reveal;
        bell.style.transform = `rotate(${swing + offset}deg)`;
      });
    }

    /* Sanctum emerges */
    if (warmGlow) warmGlow.style.opacity = String(reveal * 0.9);
    if (rays) rays.style.opacity = String(reveal * 0.8);
    if (templeBg) {
      templeBg.style.transform = `scale(${1.12 - reveal * 0.06}) translateY(${reveal * -20}px)`;
    }
    if (stage) stage.style.opacity = String(Math.max(0, (reveal - 0.35) / 0.45));
    if (incense) incense.style.opacity = String(reveal * 0.75);

    /* Petals & particles float outward */
    const petalOpacity = Math.max(0, (reveal - 0.08) / 0.6);
    heroPetals.forEach((p) => { p.style.opacity = String(petalOpacity * 0.85); });
    particles.forEach((p) => { p.style.opacity = String(reveal * 0.9); });

    /* Names & invitation content — gold calligraphy reveal */
    if (content) {
      const contentProgress = reveal < 0.55 ? 0 : Math.min(1, (reveal - 0.55) / 0.35);
      content.style.opacity = String(contentProgress);
      content.style.transform = `translateY(${28 * (1 - contentProgress)}px)`;
      content.classList.toggle('is-visible', contentProgress > 0.85);
    }
    if (nameGroom && nameBride) {
      const nameDelay = reveal < 0.58 ? 0 : Math.min(1, (reveal - 0.58) / 0.3);
      const groomOffset = 30 * (1 - Math.min(1, nameDelay * 1.2));
      const brideOffset = 30 * (1 - Math.max(0, (nameDelay - 0.15) * 1.2));
      nameGroom.style.transform = `translateX(${-groomOffset}px)`;
      nameGroom.style.opacity = String(Math.min(1, nameDelay * 1.5));
      nameBride.style.transform = `translateX(${brideOffset}px)`;
      nameBride.style.opacity = String(Math.min(1, Math.max(0, (nameDelay - 0.12) * 1.5)));
    }

    if (scrollProgress) scrollProgress.style.width = `${rawProgress * 100}%`;
    if (scrollHint) scrollHint.classList.toggle('hidden', rawProgress > 0.1);

    hero.classList.toggle('is-revealed', reveal >= 0.92);
    header?.classList.toggle('header--temple', rawProgress < 0.85);

    /* Fade curtain layer after full reveal */
    if (curtainLayer && reveal > 0.85) {
      curtainLayer.style.opacity = String(Math.max(0, 1 - (reveal - 0.85) / 0.12));
    } else if (curtainLayer) {
      curtainLayer.style.opacity = '1';
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  update();
})();

/* ============================================================
   4. STICKY HEADER ON SCROLL
   ============================================================ */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

/* ============================================================
   5. MOBILE NAVIGATION TOGGLE
   ============================================================ */
(function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
})();

/* ============================================================
   6. WEDDING COUNTDOWN TIMER
   ============================================================ */
(function initCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const ids = ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'];

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    const diff = target - Date.now();

    if (diff <= 0) {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const values = [days, hours, minutes, seconds];
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad(values[i]);
    });
  }

  update();
  setInterval(update, 1000);
})();

/* ============================================================
   7. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
