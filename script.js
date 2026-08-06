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

  // Hero petal colors (reception stage)
  heroPetalColors: ['#F4D4D4', '#FFD4B8', '#FFF8F0', '#E8B4B4', '#F5E6D3'],
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
   3. ROYAL MANUSCRIPT — scroll-synced page turns
   ============================================================ */
(function initManuscriptHero() {
  const hero = document.getElementById('hero');
  const cover = document.getElementById('ms-cover');
  const ambient = document.getElementById('ms-ambient');
  const pagePetals = document.getElementById('ms-page-petals');
  const progressBar = document.getElementById('ms-progress');
  const hint = document.getElementById('ms-hint');
  const header = document.getElementById('header');
  const soundToggle = document.getElementById('sound-toggle');

  if (!hero || !cover) return;

  header?.classList.add('header--manuscript');

  const leaves = [...document.querySelectorAll('.manuscript-hero__leaf')]
    .sort((a, b) => Number(a.dataset.leaf) - Number(b.dataset.leaf));
  const pages = [cover, ...leaves];
  const PAGE_COUNT = pages.length;

  let bellPlayed = false;
  let soundMuted = false;
  let audioCtx = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
        osc.frequency.exponentialRampToValueAtTime(freq * 0.55, now + 2.5);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1 / (i + 1), now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 3);
      });
    } catch { /* Audio unavailable */ }
  }

  soundToggle?.addEventListener('click', () => {
    soundMuted = !soundMuted;
    soundToggle.classList.toggle('muted', soundMuted);
    if (!soundMuted) bellPlayed = false;
  });

  const petalColors = ['#F4D4D4', '#FFD4B8', '#FFF8F0', '#E8B4B4', '#E8D48B'];
  if (ambient) {
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      p.className = 'manuscript-hero__ambient-petal';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${8 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      const size = 5 + Math.random() * 8;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
      ambient.appendChild(p);
    }
  }

  if (pagePetals) {
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'manuscript-hero__page-petal';
      p.style.left = `${15 + Math.random() * 70}%`;
      p.style.bottom = `${Math.random() * 30}%`;
      p.style.animationDuration = `${4 + Math.random() * 5}s`;
      p.style.animationDelay = `${Math.random() * 3}s`;
      const size = 6 + Math.random() * 8;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
      pagePetals.appendChild(p);
    }
  }

  function update() {
    const track = hero.querySelector('.manuscript-hero__track');
    const rect = track.getBoundingClientRect();
    const scrollRange = rect.height - window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const rawProgress = scrollRange > 0 ? Math.min(1, scrolled / scrollRange) : 0;
    const segment = rawProgress * PAGE_COUNT;

    pages.forEach((page, i) => {
      const turnRaw = Math.min(1, Math.max(0, segment - i));
      const turn = easeInOutCubic(turnRaw);
      page.style.transform = `rotateY(${-turn * 180}deg)`;
    });

    if (segment > 0.85 && !bellPlayed) playTempleBell();

    const finaleProgress = Math.min(1, Math.max(0, (segment - (PAGE_COUNT - 0.6)) / 0.8));
    hero.classList.toggle('is-finale', finaleProgress > 0.5);

    if (progressBar) progressBar.style.width = `${rawProgress * 100}%`;
    if (hint) hint.classList.toggle('hidden', rawProgress > 0.08);

    header?.classList.toggle('header--manuscript', rawProgress < 0.95);
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
