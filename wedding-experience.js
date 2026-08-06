/**
 * World-Class South Indian Wedding Experience
 * GSAP · Lenis · ScrollTrigger
 */

const WX_CONFIG = {
  weddingDate: '2026-09-07T09:00:00+05:30',
  petalColors: ['#F4C4C8', '#FFD4B8', '#FFF8F0', '#F4D4D4', '#E8D48B', '#FFB6C1'],
};

/* ============================================================
   LENIS SMOOTH SCROLL + GSAP
   ============================================================ */
let lenis;
let curtainOpened = false;

function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/* ============================================================
   CURTAIN OPENING CEREMONY
   ============================================================ */
function initCurtainScene() {
  const scene = document.getElementById('curtain-scene');
  const btn = document.getElementById('begin-wedding');
  const leftPanel = document.querySelector('.curtain-panel--left');
  const rightPanel = document.querySelector('.curtain-panel--right');
  const divineLight = document.querySelector('.curtain-scene__divine-light');
  const stagePreview = document.querySelector('.curtain-scene__stage-preview');
  const particles = document.getElementById('curtain-particles');
  const inner = document.querySelector('.curtain-scene__inner');
  const main = document.getElementById('wedding-main');
  const header = document.getElementById('header');

  if (!scene || !btn) return;

  createCurtainParticles(particles);

  function openCurtain() {
    if (curtainOpened) return;
    curtainOpened = true;

    playTempleBells();
    startAmbientMusic();

    const tl = gsap.timeline({
      onComplete: () => {
        scene.classList.add('is-open');
        main?.classList.add('is-visible');
        gsap.set(main, { opacity: 1 });
        header?.classList.add('header--wedding', 'is-visible');
        lenis?.start();
        initStageHero();
        initSectionTransitions();
        ScrollTrigger.refresh();
      },
    });

    tl.to(btn, { opacity: 0, y: 20, duration: 0.4 }, 0)
      .to('.curtain-scene__cta', { opacity: 0, duration: 0.3 }, 0)
      .to('.curtain-scene__lamp-flame', {
        scale: 1.5,
        filter: 'drop-shadow(0 0 30px rgba(255, 179, 71, 1))',
        duration: 1.2,
        stagger: 0.1,
      }, 0.2)
      .to(divineLight, { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.inOut' }, 0.5)
      .to(stagePreview, { opacity: 1, scale: 1, duration: 2, ease: 'power2.inOut' }, 0.8)
      .to('#curtain-particles', { opacity: 1, duration: 0.8 }, 0.6)
      .to(leftPanel, {
        x: '-105%',
        rotationY: -25,
        scaleX: 0.85,
        duration: 2.2,
        ease: 'power3.inOut',
      }, 0.6)
      .to(rightPanel, {
        x: '105%',
        rotationY: 25,
        scaleX: 0.85,
        duration: 2.2,
        ease: 'power3.inOut',
      }, 0.6)
      .to(inner, { scale: 1.08, duration: 2.5, ease: 'power2.inOut' }, 0.8)
      .to(main, { opacity: 1, duration: 0.6 }, 2.0)
      .to(scene, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 2.8);

    animateFallingPetals();
  }

  btn.addEventListener('click', openCurtain);

  let scrollAttempt = 0;
  window.addEventListener('wheel', (e) => {
    if (!curtainOpened && e.deltaY > 0) {
      scrollAttempt++;
      if (scrollAttempt > 2) openCurtain();
    }
  }, { passive: true });

  lenis?.stop();
}

function createCurtainParticles(container) {
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'curtain-scene__particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    container.appendChild(p);
  }

  gsap.to('.curtain-scene__particle', {
    y: '+=30',
    x: '+=15',
    opacity: 0.3,
    duration: 2 + Math.random() * 3,
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.05, from: 'random' },
    ease: 'sine.inOut',
  });
}

function animateFallingPetals() {
  const colors = WX_CONFIG.petalColors;
  for (let i = 0; i < 30; i++) {
    const petal = document.createElement('div');
    petal.style.cssText = `
      position:fixed; z-index:10001; pointer-events:none;
      width:${6 + Math.random() * 10}px; height:${6 + Math.random() * 10}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:50% 0 50% 50%; left:${Math.random() * 100}%; top:-20px;
    `;
    document.body.appendChild(petal);

    gsap.to(petal, {
      y: window.innerHeight + 50,
      x: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 720,
      duration: 3 + Math.random() * 3,
      ease: 'power1.in',
      onComplete: () => petal.remove(),
    });
  }
}

/* ============================================================
   AUDIO — Temple bells + ambient music
   ============================================================ */
let audioCtx = null;
let musicGain = null;
let soundMuted = false;

function playTempleBells() {
  if (soundMuted) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [520, 780, 1040, 660].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 3);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + 4);
    });
  } catch { /* Audio unavailable */ }
}

function startAmbientMusic() {
  if (soundMuted) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    musicGain = audioCtx.createGain();
    musicGain.gain.setValueAtTime(0, audioCtx.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 3);
    musicGain.connect(audioCtx.destination);

    const droneFreqs = [220, 277, 330, 440];
    droneFreqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i < 2 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015 / (i + 1), audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(musicGain);
      osc.start();
    });
  } catch { /* Audio unavailable */ }
}

function initSoundToggle() {
  const toggle = document.getElementById('sound-toggle');
  if (!toggle) return;

  toggle.classList.add('sound-toggle--wedding');
  toggle.addEventListener('click', () => {
    soundMuted = !soundMuted;
    toggle.classList.toggle('muted', soundMuted);
    if (musicGain) {
      musicGain.gain.setValueAtTime(soundMuted ? 0 : 0.04, audioCtx.currentTime);
    }
  });
}

/* ============================================================
   STAGE HERO ANIMATIONS
   ============================================================ */
function initStageHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.wedding-stage__om', { opacity: 0, y: 30, duration: 1 })
    .from('.wedding-stage__name-line', { opacity: 0, y: 50, duration: 1, stagger: 0.35 }, '-=0.5')
    .from('.wedding-stage__amp', { opacity: 0, scale: 0, duration: 0.8, ease: 'back.out(2)' }, '-=0.6')
    .from('.wedding-stage__date', { opacity: 0, letterSpacing: '0.5em', duration: 1.2 }, '-=0.4')
    .from('.wedding-stage__quote', { opacity: 0, y: 30, duration: 1 }, '-=0.6')
    .from('.wedding-stage__scroll-hint', { opacity: 0, y: 10, duration: 0.8 }, '-=0.3');
}

/* ============================================================
   SECTION TRANSITIONS
   ============================================================ */
function initSectionTransitions() {
  const transitions = [
    { id: 'story', type: 'petals' },
    { id: 'events', type: 'rangoli' },
    { id: 'family', type: 'bells' },
    { id: 'venue', type: 'silk' },
    { id: 'rsvp', type: 'sparkles' },
  ];

  transitions.forEach(({ id, type }) => {
    const section = document.getElementById(id);
    if (!section) return;

    const overlay = document.createElement('div');
    overlay.className = `section-transition transition-${type}`;
    overlay.setAttribute('aria-hidden', 'true');
    section.style.position = 'relative';
    section.insertBefore(overlay, section.firstChild);

    ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      end: 'top 20%',
      onEnter: () => playTransition(type, overlay),
      once: true,
    });

    gsap.from(section.querySelectorAll('.wx-reveal'), {
      opacity: 0,
      y: 60,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function playTransition(type, overlay) {
  switch (type) {
    case 'petals':
      for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        petal.className = 'section-transition__petal';
        petal.style.cssText = `
          width:${8 + Math.random() * 8}px; height:${8 + Math.random() * 8}px;
          left:${Math.random() * 100}%; top:${Math.random() * 100}%;
          background:${WX_CONFIG.petalColors[i % WX_CONFIG.petalColors.length]};
        `;
        overlay.appendChild(petal);
        gsap.fromTo(petal,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 0.8, duration: 0.6, delay: i * 0.05, ease: 'back.out(2)' }
        );
      }
      gsap.to(overlay, { opacity: 0, duration: 1, delay: 1.5 });
      break;

    case 'rangoli':
      gsap.fromTo(overlay,
        { scale: 0, opacity: 1 },
        { scale: 4, opacity: 0, duration: 1.8, ease: 'power2.inOut' }
      );
      break;

    case 'bells':
      overlay.innerHTML = '<span class="bell-icon">🔔</span><span class="bell-icon">🔔</span><span class="bell-icon">🔔</span>';
      gsap.from(overlay, { opacity: 1, duration: 0.3 });
      gsap.to(overlay, { opacity: 0, duration: 0.8, delay: 1.2 });
      if (!soundMuted) playTempleBells();
      break;

    case 'silk':
      gsap.fromTo(overlay,
        { x: '-100%' },
        { x: '100%', duration: 1.5, ease: 'power2.inOut', onComplete: () => { overlay.style.display = 'none'; } }
      );
      break;

    case 'jasmine':
      for (let i = 0; i < 12; i++) {
        const j = document.createElement('span');
        j.className = 'jasmine-float';
        j.textContent = '🌸';
        j.style.left = `${Math.random() * 100}%`;
        j.style.animationDelay = `${i * 0.1}s`;
        overlay.appendChild(j);
      }
      gsap.to(overlay, { opacity: 0, duration: 1, delay: 2 });
      break;

    case 'sparkles':
      gsap.fromTo(overlay,
        { scale: 0, opacity: 1, borderRadius: '50%' },
        { scale: 3, opacity: 0, duration: 2, ease: 'power2.out' }
      );
      break;
  }
}

/* ============================================================
   AMBIENT PETALS + CURSOR SPARKLES
   ============================================================ */
function initAmbientPetals() {
  const container = document.getElementById('ambient-petals');
  if (!container) return;

  for (let i = 0; i < 15; i++) {
    const petal = document.createElement('div');
    petal.className = 'ambient-petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${10 + Math.random() * 15}s`;
    petal.style.animationDelay = `${Math.random() * 12}s`;
    const size = 5 + Math.random() * 8;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.background = WX_CONFIG.petalColors[Math.floor(Math.random() * WX_CONFIG.petalColors.length)];
    container.appendChild(petal);
  }
}

function initCursorSparkles() {
  const container = document.getElementById('cursor-sparkles');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let lastX = 0;
  let lastY = 0;

  document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.sqrt(dx * dx + dy * dy) < 12) return;
    lastX = e.clientX;
    lastY = e.clientY;

    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  });
}

/* ============================================================
   BUTTON BLOOM EFFECT
   ============================================================ */
function initButtonBloom() {
  document.querySelectorAll('.wx-btn').forEach((btn) => {
    btn.addEventListener('mouseenter', (e) => {
      const bloom = document.createElement('span');
      bloom.className = 'wx-btn__bloom';
      const rect = btn.getBoundingClientRect();
      bloom.style.left = `${e.clientX - rect.left}px`;
      bloom.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(bloom);

      gsap.fromTo(bloom,
        { width: 0, height: 0, opacity: 0.6 },
        { width: 200, height: 200, opacity: 0, duration: 0.6, onComplete: () => bloom.remove() }
      );
    });
  });
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
   NAV + HEADER
   ============================================================ */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const header = document.getElementById('header');

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

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      lenis?.scrollTo(target, { offset: -72 });
    });
  });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  initSmoothScroll();
  initCurtainScene();
  initAmbientPetals();
  initCursorSparkles();
  initSoundToggle();
  initNav();
  initSmoothAnchors();
  initCountdown();
  initButtonBloom();

  gsap.set('#wedding-main', { opacity: 0 });
});
