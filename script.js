(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('field');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let points = [];

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.floor(window.innerWidth * dpr);
    height = Math.floor(window.innerHeight * dpr);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const count = Math.min(118, Math.max(56, Math.floor(window.innerWidth / 14)));
    points = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.24 * dpr,
      vy: (Math.random() - 0.5) * 0.24 * dpr,
      size: (Math.random() * 1.4 + 0.7) * dpr,
      depth: Math.random() * 0.75 + 0.25,
      tone: index % 4
    }));
  }

  function drawField() {
    if (!canvas || !ctx) return;
    if (!reduceMotion) requestAnimationFrame(drawField);
    ctx.clearRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(width * 0.5, height * 0.22, 0, width * 0.5, height * 0.4, Math.max(width, height) * 0.8);
    glow.addColorStop(0, 'rgba(98,141,255,0.08)');
    glow.addColorStop(0.42, 'rgba(158,114,255,0.036)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      point.x += point.vx * (0.75 + point.depth);
      point.y += point.vy * (0.75 + point.depth);

      if (point.x < -20) point.x = width + 20;
      if (point.x > width + 20) point.x = -20;
      if (point.y < -20) point.y = height + 20;
      if (point.y > height + 20) point.y = -20;

      for (let j = i + 1; j < points.length; j += 1) {
        const second = points[j];
        const dx = point.x - second.x;
        const dy = point.y - second.y;
        const distance = Math.hypot(dx, dy);
        const maxDistance = 128 * dpr;
        if (distance < maxDistance) {
          ctx.strokeStyle = `rgba(118,150,255,${(1 - distance / maxDistance) * 0.12})`;
          ctx.lineWidth = 0.65 * dpr;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(second.x, second.y);
          ctx.stroke();
        }
      }

      const tones = ['98,141,255', '89,228,255', '158,114,255', '114,255,212'];
      ctx.fillStyle = `rgba(${tones[point.tone]},${0.32 + point.depth * 0.38})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.size * (0.75 + point.depth), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  resizeCanvas();
  drawField();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const cursorAura = document.querySelector('.cursor-aura');
  window.addEventListener('pointermove', event => {
    if (!cursorAura) return;
    cursorAura.style.transform = `translate3d(${event.clientX - 210}px, ${event.clientY - 210}px, 0)`;
  }, { passive: true });

  const progress = document.querySelector('.scroll-progress span');
  function updateProgress() {
    if (!progress) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const value = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = `${value}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));

  document.querySelectorAll('[data-tilt]').forEach(element => {
    element.addEventListener('pointermove', event => {
      if (reduceMotion) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `rotateX(${(-y * 4.6).toFixed(2)}deg) rotateY(${(x * 5.8).toFixed(2)}deg)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });

  document.querySelectorAll('.magnetic').forEach(element => {
    element.addEventListener('pointermove', event => {
      if (reduceMotion) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.14;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.14;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });

  const header = document.querySelector('.header');
  const toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-active');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-active');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
