// ClickSpark – Pure JS (GitHub Pages Safe)
// Nova AI – Premium Interaction Effect

(() => {
  const config = {
    sparkColor: '#ffffff',
    sparkSize: 10,
    sparkRadius: 15,
    sparkCount: 8,
    duration: 400,
    easing: 'ease-out',
    extraScale: 1.0
  };

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const sparks = [];

  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = 9999;

  document.body.appendChild(canvas);

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  const ease = t =>
    config.easing === 'linear'
      ? t
      : config.easing === 'ease-in'
      ? t * t
      : config.easing === 'ease-in-out'
      ? t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      : t * (2 - t);

  document.addEventListener('click', e => {
    const now = performance.now();
    for (let i = 0; i < config.sparkCount; i++) {
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        angle: (Math.PI * 2 * i) / config.sparkCount,
        start: now
      });
    }
  });

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      const elapsed = time - s.start;

      if (elapsed > config.duration) {
        sparks.splice(i, 1);
        continue;
      }

      const p = ease(elapsed / config.duration);
      const dist = p * config.sparkRadius * config.extraScale;
      const len = config.sparkSize * (1 - p);

      const x1 = s.x + Math.cos(s.angle) * dist;
      const y1 = s.y + Math.sin(s.angle) * dist;
      const x2 = s.x + Math.cos(s.angle) * (dist + len);
      const y2 = s.y + Math.sin(s.angle) * (dist + len);

      ctx.strokeStyle = config.sparkColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();