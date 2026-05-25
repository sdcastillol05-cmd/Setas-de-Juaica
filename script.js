/* =============================================
   SETAS DE JUAICA — script.js
   Interacciones, scroll, animaciones
   ============================================= */

// ── Navbar scroll behavior ────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Hamburger menu ────────────────────────────
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('menu-open');
  const isOpen = navbar.classList.contains('menu-open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate hamburger → X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close menu on nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('menu-open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Scroll Reveal ─────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within a group
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

// Observe all [data-reveal] elements with stagger
document.querySelectorAll('[data-reveal]').forEach((el, index) => {
  // Add stagger delay based on sibling index within same parent section
  const siblings = el.parentElement.querySelectorAll('[data-reveal]');
  let siblingIndex = Array.from(siblings).indexOf(el);
  el.dataset.delay = siblingIndex * 120;
  revealObserver.observe(el);
});

// ── Product card hover tilt ───────────────────
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
    card.style.transform = `translateY(-8px) perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.12s linear, box-shadow 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)';
  });
});

// ── Smooth active nav link highlighting ───────
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinksAll.forEach(a => {
        a.style.opacity = '0.75';
        a.style.fontWeight = '400';
      });
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) {
        active.style.opacity = '1';
        active.style.fontWeight = '500';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Stats counter animation ───────────────────
function animateCounter(el, target, suffix = '', duration = 1600) {
  const isInfinity = target === '∞';
  if (isInfinity) { el.textContent = '∞'; return; }

  const isPercent = suffix === '%';
  const isZero = target === 0;

  if (isZero) {
    el.textContent = '0';
    return;
  }

  let start = null;
  const numTarget = parseFloat(target);
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * numTarget);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Trigger counters when stats section becomes visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(num => {
        const raw = num.textContent.trim();
        if (raw === '0')    animateCounter(num, 0);
        else if (raw === '100%') animateCounter(num, 100, '%');
        else if (raw === '∞')    animateCounter(num, '∞');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-row');
if (statsSection) statsObserver.observe(statsSection);

// ── Parallax on hero image ────────────────────
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.18}px)`;
    }
  }, { passive: true });
}

// ── Floating cards parallax on about visual ───
const floatingCards = document.querySelectorAll('.floating-card');
if (floatingCards.length) {
  window.addEventListener('scroll', () => {
    const aboutSection = document.getElementById('nosotros');
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    const progress = -rect.top / window.innerHeight;
    floatingCards.forEach((card, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      card.style.transform = `translateY(${progress * 20 * dir}px)`;
    });
  }, { passive: true });
}

// ── Progress bar trigger ──────────────────────
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.progress-fill');
      if (fill) {
        fill.style.animation = 'none';
        fill.offsetHeight; // reflow
        fill.style.animation = '';
      }
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.progress-bar').forEach(bar => progressObserver.observe(bar));

// ── Cursor glow effect (desktop only) ────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(107,26,43,0.1), transparent 70%);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

// ── Marquee pause on hover ────────────────────
const bandTrack = document.querySelector('.band-track');
if (bandTrack) {
  bandTrack.parentElement.addEventListener('mouseenter', () => {
    bandTrack.style.animationPlayState = 'paused';
  });
  bandTrack.parentElement.addEventListener('mouseleave', () => {
    bandTrack.style.animationPlayState = 'running';
  });
}

// ── Page load: fade in body ───────────────────
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
