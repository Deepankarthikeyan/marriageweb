import './styles/main.css';

// ---- Loader ----
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 1800);
});

// ---- Floating Petals ----
const petalsContainer = document.getElementById('petals');
const PETAL_COUNT = 18;

for (let i = 0; i < PETAL_COUNT; i++) {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${8 + Math.random() * 12}s`;
  petal.style.animationDelay = `${Math.random() * 10}s`;
  petal.style.width = `${8 + Math.random() * 8}px`;
  petal.style.height = petal.style.width;
  petalsContainer.appendChild(petal);
}

// ---- Scroll Reveal ----
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
revealElements.forEach((el) => revealObserver.observe(el));

// Trigger hero reveals on load
setTimeout(() => {
  document.querySelectorAll('.hero .reveal').forEach((el) => {
    el.classList.add('visible');
  });
}, 200);

// ---- Navigation ----
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- Music Player ----
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

musicToggle.addEventListener('click', async () => {
  try {
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
      musicToggle.classList.add('muted');
      musicToggle.title = 'Play music';
    } else {
      await bgMusic.play();
      musicToggle.classList.add('playing');
      musicToggle.classList.remove('muted');
      musicToggle.title = 'Pause music';
    }
    isPlaying = !isPlaying;
  } catch {
    musicToggle.classList.add('muted');
  }
});

// Auto-prompt music on first interaction
let musicPrompted = false;
document.addEventListener(
  'click',
  () => {
    if (!musicPrompted && !isPlaying) {
      musicPrompted = true;
      bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.classList.remove('muted');
      }).catch(() => {});
    }
  },
  { once: true }
);

// ---- Countdown Timer ----
const WEDDING_DATE = new Date('2026-09-07T09:00:00+05:30').getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-minutes').textContent = '00';
    document.getElementById('cd-seconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---- Smooth parallax on hero florals ----
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  document.querySelectorAll('.hero__floral').forEach((floral, i) => {
    const speed = 0.05 + i * 0.02;
    floral.style.transform = `translateY(${scrolled * speed}px)`;
  });
});
