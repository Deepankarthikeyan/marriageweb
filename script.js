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

  // Reveal hero content immediately
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('visible'));
  }, 300);
})();

/* ============================================================
   3. STICKY HEADER ON SCROLL
   ============================================================ */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

/* ============================================================
   4. MOBILE NAVIGATION TOGGLE
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
   5. WEDDING COUNTDOWN TIMER
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
   6. SMOOTH SCROLL FOR ANCHOR LINKS
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
