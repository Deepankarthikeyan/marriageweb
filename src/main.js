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

// ---- YouTube Music: Manamaganin Sathiyam (Kochadaiiyaan) ----
const YT_VIDEO_ID = 'R5Wa9J3Whis'; // Official Sony Music South VEVO
const musicToggle = document.getElementById('music-toggle');
const musicCredit = document.getElementById('music-credit');
let ytPlayer = null;
let isPlaying = false;
let ytReady = false;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      loop: 1,
      playlist: YT_VIDEO_ID,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
    events: {
      onReady: () => { ytReady = true; },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          isPlaying = true;
          musicToggle.classList.add('playing');
          musicToggle.classList.remove('muted');
          musicCredit?.classList.add('visible');
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
          isPlaying = false;
          musicToggle.classList.remove('playing');
          musicToggle.classList.add('muted');
        }
      },
    },
  });
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

if (window.YT?.Player) {
  onYouTubeIframeAPIReady();
}

musicToggle.addEventListener('click', () => {
  if (!ytReady || !ytPlayer?.playVideo) {
    musicToggle.classList.add('muted');
    return;
  }
  if (isPlaying) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
  }
});

let musicPrompted = false;
document.addEventListener(
  'click',
  () => {
    if (!musicPrompted && !isPlaying && ytReady && ytPlayer?.playVideo) {
      musicPrompted = true;
      ytPlayer.playVideo();
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
