import './styles/main.css';

// ---- Loader ----
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 2000);
});

// ---- Marigold petals ----
const petalsContainer = document.getElementById('petals');
const PETAL_COUNT = 22;
const MARIGOLD_COLORS = ['#FF9933', '#FFB347', '#FFCC66', '#E8842A', '#FFD700'];

for (let i = 0; i < PETAL_COUNT; i++) {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${6 + Math.random() * 10}s`;
  petal.style.animationDelay = `${Math.random() * 8}s`;
  const size = 8 + Math.random() * 10;
  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.background = MARIGOLD_COLORS[Math.floor(Math.random() * MARIGOLD_COLORS.length)];
  petalsContainer.appendChild(petal);
}

// ---- Scroll Reveal ----
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealElements.forEach((el) => revealObserver.observe(el));

setTimeout(() => {
  document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('visible'));
}, 300);

// ---- Navigation ----
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
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
    } else {
      await bgMusic.play();
      musicToggle.classList.add('playing');
      musicToggle.classList.remove('muted');
    }
    isPlaying = !isPlaying;
  } catch {
    musicToggle.classList.add('muted');
  }
});

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

// ---- Countdown ----
const WEDDING_DATE = new Date('2026-09-07T09:00:00+05:30').getTime();

function updateCountdown() {
  const diff = WEDDING_DATE - Date.now();
  const ids = ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'];
  if (diff <= 0) {
    ids.forEach((id) => { document.getElementById(id).textContent = '00'; });
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---- Parallax hero ----
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.querySelector('.hero__bg-img');
  if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
});
