const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Mobile nav toggle ===== */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    burger.classList.toggle('is-open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('is-open');
    });
  });
}

/* ===== Scroll progress bar ===== */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ===== Nav shadow on scroll ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 12 ? '0 8px 24px -12px rgba(0,0,0,0.5)' : 'none';
}, { passive: true });

/* ===== Cursor glow (desktop only) ===== */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
  let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
  let tx = gx, ty = gy;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  function animateGlow() {
    gx += (tx - gx) * 0.15;
    gy += (ty - gy) * 0.15;
    cursorGlow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  if (!reduceMotion) animateGlow();
}

/* ===== Particle network background ===== */
const canvas = document.getElementById('bgCanvas');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const COUNT = 46;
  const LINK_DIST = 130;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  function makeParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * Math.min(h, window.innerHeight * 1.4),
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  }
  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); }, { passive: true });

  function tick() {
    ctx.clearRect(0, 0, w, h);
    const viewTop = window.scrollY - 200;
    const viewBottom = window.scrollY + window.innerHeight + 200;

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > Math.min(h, window.innerHeight * 1.4)) p.vy *= -1;
    }

    ctx.fillStyle = 'rgba(201,162,75,0.55)';
    for (const p of particles) {
      if (p.y < viewTop || p.y > viewBottom) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        if (a.y < viewTop || a.y > viewBottom) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(201,162,75,${0.12 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
}

/* ===== Magnetic buttons ===== */
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  if (!window.matchMedia('(hover: hover)').matches || reduceMotion) return;
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ===== 3D tilt (service cards, portfolio cards) ===== */
document.querySelectorAll('[data-tilt]').forEach(card => {
  if (!window.matchMedia('(hover: hover)').matches || reduceMotion) return;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 10;
    const rotateY = (x - 0.5) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    card.style.setProperty('--x', `${x * 100}%`);
    card.style.setProperty('--y', `${y * 100}%`);
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ===== Soft tilt (browser mockup, pricing cards) ===== */
document.querySelectorAll('[data-tilt-soft]').forEach(card => {
  if (!window.matchMedia('(hover: hover)').matches || reduceMotion) return;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 5;
    const rotateY = (x - 0.5) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ===== Count-up stats ===== */
const statEls = document.querySelectorAll('.stat-num[data-count]');
function countUp(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
statEls.forEach(el => statObserver.observe(el));

/* ===== Scroll reveal for cards without data-reveal ===== */
const revealTargets = document.querySelectorAll(
  '.service-card, .portfolio-card, .price-card, .testimonial-carousel, .faq-item'
);
revealTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = (el.style.transform || '') + ' translateY(16px)';
  el.style.transition = `opacity .6s ease ${(i % 4) * 0.06}s, transform .6s ease ${(i % 4) * 0.06}s`;
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = entry.target.style.transform.replace('translateY(16px)', 'translateY(0)');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => revealObserver.observe(el));

/* ===== Testimonial carousel ===== */
const testiTrack = document.getElementById('testiTrack');
const testiDots = document.getElementById('testiDots');
if (testiTrack && testiDots) {
  const slides = testiTrack.querySelectorAll('.testimonial-card');
  const dots = testiDots.querySelectorAll('.dot-btn');
  let active = 0;
  let autoplay;

  function goTo(index) {
    slides[active].classList.remove('is-active');
    dots[active].classList.remove('is-active');
    active = (index + slides.length) % slides.length;
    slides[active].classList.add('is-active');
    dots[active].classList.add('is-active');
  }
  function startAutoplay() {
    if (reduceMotion) return;
    autoplay = setInterval(() => goTo(active + 1), 5500);
  }
  function stopAutoplay() { clearInterval(autoplay); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); stopAutoplay(); startAutoplay(); });
  });
  testiTrack.addEventListener('mouseenter', stopAutoplay);
  testiTrack.addEventListener('mouseleave', startAutoplay);
  startAutoplay();
}

/* ===== FAQ accordion ===== */
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
      }
    });
    item.classList.toggle('is-open', !isOpen);
    answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
  });
});

/* ===== ORDER PAGE: package pricing + form simulation ===== */
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  const packages = {
    starter: { name: 'Starter', base: 3500000, days: '5–7 hari', includes: ['1 halaman utama', 'Desain responsif', 'Revisi 2x'], isFrom: false },
    profesional: { name: 'Profesional', base: 8500000, days: '10–14 hari', includes: ['Sampai 6 halaman', 'Desain custom penuh', 'Revisi 4x'], isFrom: false },
    enterprise: { name: 'Enterprise', base: 18000000, days: 'Disesuaikan', includes: ['Halaman & fitur tak terbatas', 'Integrasi sistem/API', 'Pendampingan 30 hari'], isFrom: true },
  };

  const rupiah = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  const summaryName = document.getElementById('summaryName');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryIncludes = document.getElementById('summaryIncludes');
  const summaryBase = document.getElementById('summaryBase');
  const summaryDP = document.getElementById('summaryDP');
  const summaryRemaining = document.getElementById('summaryRemaining');
  const summaryDays = document.getElementById('summaryDays');

  function updateSummary() {
    const selected = orderForm.querySelector('input[name="package"]:checked');
    const key = selected ? selected.value : 'profesional';
    const pkg = packages[key];
    const prefix = pkg.isFrom ? 'Mulai ' : '';

    summaryName.textContent = pkg.name;
    summaryPrice.textContent = prefix + rupiah(pkg.base);
    summaryBase.textContent = prefix + rupiah(pkg.base);
    summaryDP.textContent = prefix + rupiah(pkg.base * 0.1);
    summaryRemaining.textContent = prefix + rupiah(pkg.base * 0.9);
    summaryDays.textContent = pkg.days;

    summaryIncludes.innerHTML = '';
    pkg.includes.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      summaryIncludes.appendChild(li);
    });
  }

  orderForm.querySelectorAll('input[name="package"]').forEach(radio => {
    radio.addEventListener('change', updateSummary);
  });

  const preselect = new URLSearchParams(window.location.search).get('paket');
  if (preselect && packages[preselect]) {
    const radioToCheck = orderForm.querySelector(`input[name="package"][value="${preselect}"]`);
    if (radioToCheck) radioToCheck.checked = true;
  }
  updateSummary();

  /* Front-end only submit simulation — not yet connected to any backend/database */
  const confirmationPanel = document.getElementById('confirmationPanel');
  const resetOrderBtn = document.getElementById('resetOrder');

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }
    const selected = orderForm.querySelector('input[name="package"]:checked');
    const pkg = packages[selected ? selected.value : 'profesional'];
    const prefix = pkg.isFrom ? 'mulai ' : '';
    const name = document.getElementById('fullName').value.trim();

    document.getElementById('confName').textContent = name;
    document.getElementById('confPackage').textContent = pkg.name;
    document.getElementById('confDP').textContent = prefix + rupiah(pkg.base * 0.1);

    orderForm.hidden = true;
    confirmationPanel.hidden = false;
    confirmationPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  if (resetOrderBtn) {
    resetOrderBtn.addEventListener('click', () => {
      orderForm.reset();
      updateSummary();
      confirmationPanel.hidden = true;
      orderForm.hidden = false;
      orderForm.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }
}
