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
   3. WEDDING RECEPTION STAGE HERO — cinematic load + parallax
   ============================================================ */
(function initReceptionHero() {
  const hero = document.getElementById('hero');
  const scene = document.getElementById('reception-scene');
  const stage = document.getElementById('reception-stage');
  const petalsContainer = document.getElementById('reception-petals');
  const sparklesContainer = document.getElementById('reception-sparkles');
  const scrollHint = document.getElementById('reception-scroll-hint');
  const header = document.getElementById('header');

  if (!hero) return;

  header?.classList.add('header--reception');

  /* Floating petals */
  if (petalsContainer) {
    for (let i = 0; i < 22; i++) {
      const petal = document.createElement('div');
      petal.className = 'reception-hero__petal';
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${7 + Math.random() * 9}s`;
      petal.style.animationDelay = `${1.2 + Math.random() * 5}s`;
      const size = 6 + Math.random() * 10;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.background = CONFIG.heroPetalColors[Math.floor(Math.random() * CONFIG.heroPetalColors.length)];
      petalsContainer.appendChild(petal);
    }
  }

  /* Sparkle particles */
  if (sparklesContainer) {
    for (let i = 0; i < 30; i++) {
      const s = document.createElement('div');
      s.className = 'reception-hero__sparkle';
      s.style.left = `${15 + Math.random() * 70}%`;
      s.style.top = `${10 + Math.random() * 75}%`;
      s.style.animationDelay = `${Math.random() * 4}s`;
      s.style.animationDuration = `${2 + Math.random() * 3}s`;
      sparklesContainer.appendChild(s);
    }
  }

  /* Choreographed load sequence */
  const sequence = [
    [200, 'is-focused'],
    [700, 'is-chandeliers'],
    [950, 'is-fairy'],
    [1100, 'is-lamps'],
    [1200, 'is-rays'],
    [1700, 'is-names'],
    [2100, 'is-details'],
    [2500, 'is-cta'],
    [2900, 'is-scroll-hint'],
  ];

  sequence.forEach(([delay, className]) => {
    setTimeout(() => hero.classList.add(className), delay);
  });

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateParallax() {
    const track = hero.querySelector('.reception-hero__track');
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const scrollRange = window.innerHeight * 0.8;
    const scrolled = Math.max(0, -rect.top);
    const progress = easeOutCubic(Math.min(1, scrolled / scrollRange));

    if (scene) {
      const scale = 1 + progress * 0.06;
      const y = progress * -30;
      scene.style.transform = `scale(${scale}) translateY(${y}px)`;
    }

    if (stage) {
      stage.style.transform = `translateY(${progress * -15}px) scale(${1 + progress * 0.02})`;
    }

    if (scrollHint) {
      scrollHint.style.opacity = String(Math.max(0, 1 - progress * 2.5));
    }

    header?.classList.toggle('header--reception', scrolled < window.innerHeight * 0.7);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
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
