/* =========================================================
   RAFI ARDIANSYAH — FUTURISTIC PORTFOLIO — SCRIPT.JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------
     1. LOADING SCREEN
  ------------------------------------------------- */
  const loader = document.getElementById('loader');
  const loaderPercent = document.getElementById('loaderPercent');
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => loader.classList.add('hidden'), 350);
    }
    loaderPercent.textContent = progress + '%';
  }, 120);

  /* -------------------------------------------------
     2. CUSTOM CURSOR + MOUSE GLOW
  ------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const mouseGlow = document.getElementById('mouseGlow');
  const isTouchDevice = window.matchMedia('(max-width: 860px)').matches;

  if (!isTouchDevice) {
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      mouseGlow.style.left = mouseX + 'px';
      mouseGlow.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  } else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* -------------------------------------------------
     3. PARTICLE BACKGROUND (canvas)
  ------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = ['#00F5FF', '#8A2BE2', '#00FF88', '#FF3CAC', '#FFD93D'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createParticles() {
    const count = window.innerWidth < 700 ? 40 : 90;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2
    }));
  }
  createParticles();
  window.addEventListener('resize', createParticles);

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (!reducedMotion) requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* -------------------------------------------------
     4. TYPING EFFECT (professional title)
  ------------------------------------------------- */
  const typingEl = document.getElementById('typingText');
  const roles = [
    'Web Developer',
    'UI/UX Designer',
    'Computer Network Engineering Student'
  ];
  let roleIndex = 0, charIndex = 0, typingForward = true;

  function typeLoop() {
    const current = roles[roleIndex];
    if (typingForward) {
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        typingForward = false;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        typingForward = true;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, typingForward ? 65 : 32);
  }
  typeLoop();

  /* -------------------------------------------------
     5. SCROLL REVEAL (IntersectionObserver)
  ------------------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* -------------------------------------------------
     6. SKILL BARS + CIRCULAR RINGS ON VIEW
  ------------------------------------------------- */
  const skillItems = document.querySelectorAll('.skill-item');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const target = parseInt(item.dataset.percent, 10);
      const fill = item.querySelector('.skill-bar-fill');
      const percentLabel = item.querySelector('.skill-percent');
      fill.classList.add('in-view');

      let current = 0;
      const step = Math.max(1, Math.round(target / 40));
      const counter = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(counter); }
        percentLabel.textContent = current + '%';
      }, 30);

      skillObserver.unobserve(item);
    });
  }, { threshold: 0.3 });
  skillItems.forEach(el => skillObserver.observe(el));

  const ringItems = document.querySelectorAll('.ring-item');
  const RING_CIRCUMFERENCE = 264; // 2 * PI * 42, matches CSS stroke-dasharray
  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const percent = parseInt(item.dataset.ringPercent, 10);
      const progressCircle = item.querySelector('.ring-progress');
      const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * percent) / 100;
      progressCircle.style.strokeDashoffset = offset;
      ringObserver.unobserve(item);
    });
  }, { threshold: 0.3 });
  ringItems.forEach(el => ringObserver.observe(el));

  /* -------------------------------------------------
     7. MOUSE-FOLLOWING GLOW (already positioned via mousemove above)
  ------------------------------------------------- */

  /* -------------------------------------------------
     8. MAGNETIC BUTTONS
  ------------------------------------------------- */
  if (!isTouchDevice) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* -------------------------------------------------
     9. RIPPLE EFFECT ON BUTTONS
  ------------------------------------------------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.querySelector('.btn-ripple-layer').appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* -------------------------------------------------
     10. 3D TILT ON GLASS CARDS
  ------------------------------------------------- */
  if (!isTouchDevice) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  /* -------------------------------------------------
     11. SCROLL NAV DOTS — ACTIVE STATE + CLICK
  ------------------------------------------------- */
  const sections = document.querySelectorAll('.section');
  const navDots = document.querySelectorAll('.nav-dot');

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navDots.forEach(dot => {
          dot.classList.toggle('active', dot.dataset.target === id);
        });
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(sec => sectionObserver.observe(sec));

  /* -------------------------------------------------
     12. SMOOTH ANCHOR SCROLL (fallback for older browsers)
  ------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
