export function initSakura() {
  const canvas = document.getElementById('sakura-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;

  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  const PETAL_COUNT = 35;
  const petals = [];

  const colors = ['#ff6b9d', '#ff8fab', '#ffb3c6', '#ffc8dd', '#ff9ebb', '#e8a0bf'];

  class Petal {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H * -1 : -20;
      this.size = Math.random() * 10 + 6;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.speedY = Math.random() * 1.5 + 0.8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.04;
      this.opacity = Math.random() * 0.6 + 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.sway += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.sway) * 0.8;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      if (this.y > H + 30) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;

      // Petal shape
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(
        this.size / 2, -this.size / 2,
        this.size / 2, this.size / 2,
        0, this.size / 2
      );
      ctx.bezierCurveTo(
        -this.size / 2, this.size / 2,
        -this.size / 2, -this.size / 2,
        0, -this.size / 2
      );
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  let running = true;

  function animate() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();

  return () => { running = false; };
}
