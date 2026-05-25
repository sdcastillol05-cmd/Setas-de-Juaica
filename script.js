/* =============================================
   SETAS DE JUAICA — script.js v2
   ============================================= */

// ── Page load fade ────────────────────────────
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
window.addEventListener('load', () => { document.body.style.opacity = '1'; });

// ── Navbar scroll ─────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger ────────────────────────────────
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  navbar.classList.toggle('menu-open');
  const isOpen = navbar.classList.contains('menu-open');
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('menu-open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Scroll Reveal ─────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  const siblings = el.parentElement.querySelectorAll('[data-reveal]');
  el.dataset.delay = Array.from(siblings).indexOf(el) * 120;
  revealObs.observe(el);
});

// ── Mushroom SVG floaters ─────────────────────
(function spawnMushrooms() {
  const field = document.getElementById('mushroomField');
  if (!field) return;

  // SVG paths for mushroom shapes (cap + stem variants)
  const caps = [
    // round cap
    `<ellipse cx="18" cy="14" rx="16" ry="11" fill="currentColor"/>
     <path d="M10 14 Q10 26 18 26 Q26 26 26 14" fill="currentColor" opacity="0.7"/>
     <ellipse cx="18" cy="14" rx="10" ry="6" fill="currentColor" opacity="0.2"/>`,
    // flat oyster cap
    `<path d="M2 18 Q4 4 18 6 Q32 4 34 18 Q28 22 18 20 Q8 22 2 18Z" fill="currentColor"/>
     <path d="M12 18 Q12 28 18 28 Q24 28 24 18" fill="currentColor" opacity="0.75"/>`,
    // dome cap
    `<path d="M4 20 Q4 4 18 3 Q32 4 32 20 Z" fill="currentColor"/>
     <rect x="13" y="20" width="10" height="10" rx="3" fill="currentColor" opacity="0.75"/>
     <circle cx="18" cy="20" r="3" fill="currentColor" opacity="0.3"/>`,
  ];

  const colors = [
    'rgba(107,26,43,0.18)',
    'rgba(140,34,56,0.14)',
    'rgba(107,26,43,0.1)',
    'rgba(200,192,180,0.08)',
    'rgba(107,26,43,0.22)',
  ];

  function makeMushroom() {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const size = 32 + Math.random() * 64;
    el.setAttribute('viewBox', '0 0 36 32');
    el.setAttribute('width', size);
    el.setAttribute('height', size);
    el.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.innerHTML = caps[Math.floor(Math.random() * caps.length)];

    el.classList.add('mushroom-shroom');

    const startX = 5 + Math.random() * 90; // %
    const startY = 85 + Math.random() * 20; // start below fold
    const duration = 18 + Math.random() * 22; // s
    const delay    = Math.random() * 18;
    const drift    = (Math.random() - 0.5) * 120; // px horizontal drift

    el.style.cssText += `
      left: ${startX}%;
      bottom: -${size * 1.5}px;
      color: ${el.style.color};
      animation-name: mushroomFloat;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      --drift: ${drift}px;
    `;

    field.appendChild(el);
  }

  // Override animation with drift
  const style = document.createElement('style');
  style.textContent = `
    @keyframes mushroomFloat {
      0%   { transform: translateX(0)         translateY(0)      rotate(0deg)   scale(1);    opacity: 0; }
      8%   {                                                                                   opacity: 1; }
      50%  { transform: translateX(calc(var(--drift, 0px) * 0.5)) translateY(-55vh) rotate(12deg) scale(0.95); }
      85%  {                                                                                   opacity: 0.5; }
      100% { transform: translateX(var(--drift, 0px)) translateY(-110vh) rotate(25deg) scale(0.8); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const COUNT = window.matchMedia('(max-width: 600px)').matches ? 10 : 18;
  for (let i = 0; i < COUNT; i++) makeMushroom();
})();

// ── Product card tilt ─────────────────────────
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
    card.style.transition = 'transform 0.1s linear';
    card.style.transform  = `translateY(-6px) perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.8,0.25,1)';
    card.style.transform  = '';
  });
});

// ── Active nav highlight ──────────────────────
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => { a.style.opacity = '0.65'; a.style.fontWeight = '500'; });
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) { a.style.opacity = '1'; a.style.fontWeight = '700'; }
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => secObs.observe(s));

// ── Stats counter ─────────────────────────────
function animateCounter(el, raw) {
  if (raw === '∞') { el.textContent = '∞'; return; }
  if (raw === '0') { el.textContent = '0'; return; }
  const isPercent = raw.includes('%');
  const num = parseFloat(raw);
  let start = null;
  const tick = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / 1600, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * num) + (isPercent ? '%' : '');
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(n => animateCounter(n, n.textContent.trim()));
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObs.observe(statsRow);

// ── Hero parallax ─────────────────────────────
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight)
      heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.18}px)`;
  }, { passive: true });
}

// ── Floating card parallax ────────────────────
const floatCards = document.querySelectorAll('.floating-card');
if (floatCards.length) {
  window.addEventListener('scroll', () => {
    const about = document.getElementById('nosotros');
    if (!about) return;
    const rect = about.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    const progress = -rect.top / window.innerHeight;
    floatCards.forEach((c, i) => {
      c.style.transform = `translateY(${progress * 18 * (i % 2 === 0 ? 1 : -1)}px)`;
    });
  }, { passive: true });
}

// ── Progress bar trigger ──────────────────────
const progObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.progress-fill');
      if (fill) { fill.style.animation = 'none'; fill.offsetHeight; fill.style.animation = ''; }
      progObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.progress-bar').forEach(b => progObs.observe(b));

// ── Cursor glow (desktop) ─────────────────────
if (window.matchMedia('(pointer:fine)').matches) {
  const g = document.createElement('div');
  g.style.cssText = `position:fixed;width:240px;height:240px;border-radius:50%;
    background:radial-gradient(circle,rgba(107,26,43,0.09),transparent 70%);
    pointer-events:none;z-index:9998;transform:translate(-50%,-50%);
    transition:left 0.18s ease,top 0.18s ease;mix-blend-mode:screen;`;
  document.body.appendChild(g);
  window.addEventListener('mousemove', e => {
    g.style.left = e.clientX + 'px';
    g.style.top  = e.clientY + 'px';
  }, { passive: true });
}

// ── Marquee pause ─────────────────────────────
const band = document.querySelector('.band-track');
if (band) {
  band.parentElement.addEventListener('mouseenter', () => band.style.animationPlayState = 'paused');
  band.parentElement.addEventListener('mouseleave', () => band.style.animationPlayState = 'running');
}
