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
   3. CINEMATIC TEMPLE DOORS — scroll-driven 3D open
   ============================================================ */
(function initCinematicHero() {
  const hero = document.getElementById('hero');
  const doorLeft = document.getElementById('door-left');
  const doorRight = document.getElementById('door-right');
  const entrance = document.getElementById('door-entrance');
  const welcome = document.getElementById('welcome-content');
  const sanctumBg = document.getElementById('sanctum-bg');
  const heroGlow = document.getElementById('hero-glow');
  const heroRays = document.getElementById('hero-rays');
  const warmLight = document.getElementById('warm-light');
  const gopuramWrap = document.getElementById('gopuram-wrap');
  const weddingStage = document.getElementById('wedding-stage');
  const incense = document.getElementById('hero-incense');
  const pillars = document.querySelectorAll('.cinematic-hero__pillar');
  const sanctumLamps = document.querySelector('.cinematic-hero__sanctum-lamps');
  const jasmineGarland = document.querySelector('.cinematic-hero__jasmine-garland');
  const sanctumDiyas = document.querySelector('.cinematic-hero__sanctum-diyas');
  const rangoli = document.querySelector('.cinematic-hero__rangoli--sanctum');
  const hangingBells = document.querySelector('.cinematic-hero__hanging-bells');
  const entranceLamps = document.querySelector('.cinematic-hero__entrance-lamps');
  const entranceSteps = document.querySelector('.cinematic-hero__steps');
  const scrollHint = document.getElementById('scroll-hint');
  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  const soundToggle = document.getElementById('sound-toggle');
  const particlesContainer = document.getElementById('hero-particles');
  const heroPetalsContainer = document.getElementById('hero-petals');

  if (!hero || !doorLeft || !doorRight) return;

  header?.classList.add('header--temple');

  let bellPlayed = false;
  let soundMuted = false;
  let audioCtx = null;

  /* Easing functions */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  /* Temple bell via Web Audio API */
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
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 2.5);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12 / (i + 1), now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 3);
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

  /* Light particles */
  const particles = [];
  if (particlesContainer) {
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'cinematic-hero__particle';
      const size = 2 + Math.random() * 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${20 + Math.random() * 60}%`;
      p.style.top = `${30 + Math.random() * 50}%`;
      p.style.animationDelay = `${Math.random() * 4}s`;
      p.style.animationDuration = `${3 + Math.random() * 4}s`;
      p.style.opacity = '0';
      particlesContainer.appendChild(p);
      particles.push(p);
    }
  }

  /* Hero floating petals */
  const petalColors = ['#F4D4D4', '#E8D48B', '#FFD4B8', '#D4847C'];
  if (heroPetalsContainer) {
    for (let i = 0; i < 14; i++) {
      const petal = document.createElement('div');
      petal.className = 'cinematic-hero__hero-petal';
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${6 + Math.random() * 8}s`;
      petal.style.animationDelay = `${Math.random() * 6}s`;
      const size = 6 + Math.random() * 8;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
      heroPetalsContainer.appendChild(petal);
    }
  }

  function update() {
    const track = hero.querySelector('.cinematic-hero__track');
    const rect = track.getBoundingClientRect();
    const scrollRange = window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const rawProgress = Math.min(1, scrolled / scrollRange);
    const progress = easeInOutQuart(rawProgress);
    const doorProgress = easeOutCubic(rawProgress);

    /* 3D door rotation — opens outward */
    const angle = doorProgress * 94;
    doorLeft.style.transform = `rotateY(-${angle}deg)`;
    doorRight.style.transform = `rotateY(${angle}deg)`;

    /* Play bell when doors begin opening */
    if (rawProgress > 0.04) playTempleBell();

    /* Fade entrance as doors open */
    if (entrance) {
      entrance.style.opacity = Math.max(0, 1 - doorProgress * 1.3);
    }

    /* Golden glow emerges */
    if (heroGlow) {
      heroGlow.style.opacity = doorProgress * 0.9;
      heroGlow.style.transform = `translate(-50%, -50%) scale(${0.8 + doorProgress * 0.4})`;
    }

    /* Sun rays */
    if (heroRays) heroRays.style.opacity = String(doorProgress * 0.75);

    if (warmLight) warmLight.style.opacity = String(doorProgress * 0.85);

    if (gopuramWrap) {
      gopuramWrap.style.transform = `translateX(-50%) translateY(${doorProgress * -30}px) scale(${1 - doorProgress * 0.05})`;
    }

    if (hangingBells) {
      hangingBells.style.transform = `translateY(${doorProgress * -12}px)`;
    }

    if (entranceLamps) {
      entranceLamps.style.transform = `translateY(${doorProgress * -8}px)`;
      entranceLamps.style.opacity = String(Math.max(0, 1 - doorProgress * 1.1));
    }

    if (entranceSteps) {
      entranceSteps.style.opacity = String(Math.max(0, 1 - doorProgress * 1.2));
    }

    if (sanctumBg) {
      sanctumBg.style.transform = `scale(${1.08 + doorProgress * 0.06}) translateY(${doorProgress * -24}px)`;
    }

    const decorOpacity = Math.max(0, (doorProgress - 0.25) / 0.55);
    if (weddingStage) weddingStage.style.opacity = String(decorOpacity);
    if (sanctumLamps) sanctumLamps.style.opacity = String(decorOpacity);
    if (jasmineGarland) jasmineGarland.style.opacity = String(decorOpacity);
    if (sanctumDiyas) sanctumDiyas.style.opacity = String(decorOpacity);
    if (rangoli) rangoli.style.opacity = String(decorOpacity);
    if (incense) incense.style.opacity = String(doorProgress * 0.6);
    pillars.forEach((p) => { p.style.opacity = String(decorOpacity); });

    /* Names fade in at 80% door open */
    if (welcome) {
      const nameProgress = doorProgress < 0.8 ? 0 : (doorProgress - 0.8) / 0.2;
      welcome.style.opacity = nameProgress;
      welcome.style.transform = `translateY(${24 * (1 - nameProgress)}px)`;
    }

    /* Particles intensify */
    particles.forEach((p) => {
      p.style.opacity = String(doorProgress * 0.8);
    });

    /* Hero petals visible as doors open */
    heroPetalsContainer?.querySelectorAll('.cinematic-hero__hero-petal').forEach((p) => {
      p.style.opacity = String(doorProgress * 0.7);
    });

    if (scrollProgress) scrollProgress.style.width = `${rawProgress * 100}%`;
    if (scrollHint) scrollHint.classList.toggle('hidden', rawProgress > 0.12);

    hero.classList.toggle('doors-open', doorProgress >= 0.95);
    header?.classList.toggle('header--temple', rawProgress < 0.9);
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
