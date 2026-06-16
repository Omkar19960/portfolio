/* ═══════════════════════════════════════════════
   script.js — Omkar Moratle Portfolio v2
   FULLY ANIMATED BACKGROUND across all sections
═══════════════════════════════════════════════ */

// ── CURSOR ────────────────────────────────────
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px'; }
  requestAnimationFrame(animCursor);
}
animCursor();

// ── LOADER ────────────────────────────────────
const loader    = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderTxt = document.getElementById('loaderText');
const steps     = [[20,'Loading dataset…'],[45,'Running EDA…'],[70,'Fitting model…'],[90,'Generating insights…'],[100,'Ready.']];
let si = 0;
function runLoader() {
  if (si >= steps.length) { setTimeout(() => loader.classList.add('hidden'), 300); return; }
  const [pct, txt] = steps[si++];
  loaderBar.style.width = pct + '%';
  loaderTxt.textContent = txt;
  setTimeout(runLoader, 400);
}
runLoader();

// ── NAV ───────────────────────────────────────
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) navLinks.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + s.id));
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
});

// ══════════════════════════════════════════════
//  MASTER FULLPAGE ANIMATED BACKGROUND CANVAS
//  Covers the entire document height, fixed
// ══════════════════════════════════════════════
(function initMasterBg() {
  const canvas = document.getElementById('masterBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, tick = 0;

  /* ─ PARTICLES ─ */
  const PCOUNT = 90;
  const particles = [];
  class Particle {
    constructor() { this.reset(true); }
    reset(rand) {
      this.x  = Math.random() * W;
      this.y  = rand ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -Math.random() * 0.4 - 0.1;
      this.r  = Math.random() * 1.6 + 0.4;
      this.a  = Math.random() * 0.45 + 0.1;
      this.color = Math.random() > 0.5 ? '#f59e0b' : '#a78bfa';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
    }
    draw() {
      ctx.save(); ctx.globalAlpha = this.a;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
    }
  }

  /* ─ FLOWING DATA STREAMS (vertical rain lines) ─ */
  const STREAMS = 30;
  const streams = Array.from({length: STREAMS}, () => ({
    x: Math.random(),
    y: Math.random(),
    speed: 0.0006 + Math.random() * 0.0012,
    len: 0.06 + Math.random() * 0.12,
    alpha: 0.06 + Math.random() * 0.1,
    char: () => ['0','1','∑','μ','σ','R²','df','p','β','∇','λ'][Math.floor(Math.random()*11)],
    charTimer: 0,
    currentChar: '1',
  }));

  /* ─ FLOATING HEXAGONS ─ */
  const HEXES = 12;
  const hexes = Array.from({length: HEXES}, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    size: 30 + Math.random() * 60,
    speed: 0.00015 + Math.random() * 0.0002,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.003,
    alpha: 0.04 + Math.random() * 0.07,
  }));

  /* ─ SINE WAVE GRID ─ */
  const GRID_COLS = 22, GRID_ROWS = 14;

  /* ─ ORBIT RINGS ─ */
  const RINGS = 3;
  const rings = Array.from({length: RINGS}, (_, i) => ({
    x: 0.15 + i * 0.35,
    y: 0.5 + (i % 2 === 0 ? 0.2 : -0.1),
    r: 80 + i * 55,
    speed: 0.0006 + i * 0.0003,
    phase: (i / RINGS) * Math.PI * 2,
    alpha: 0.07,
  }));

  function drawHex(ctx, x, y, size, rot) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = rot + (i / 6) * Math.PI * 2;
      const px = x + size * Math.cos(a);
      const py = y + size * Math.sin(a);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = document.documentElement.scrollHeight;
    // reinit particles
    particles.length = 0;
    for (let i = 0; i < PCOUNT; i++) { const p = new Particle(); p.y = Math.random() * H; particles.push(p); }
    // spread streams
    streams.forEach(s => { s.x = Math.random(); s.y = Math.random(); });
    // spread hexes
    hexes.forEach(h => { h.x = Math.random(); h.y = Math.random(); });
    // spread rings
    rings.forEach((r, i) => { r.x = 0.1 + Math.random() * 0.8; r.y = 0.1 + Math.random() * 0.8; });
  }

  function frame() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    // ── 1. SINE WAVE GRID (dots) ──────────────
    const gw = W / GRID_COLS, gh = H / GRID_ROWS;
    for (let row = 0; row <= GRID_ROWS; row++) {
      for (let col = 0; col <= GRID_COLS; col++) {
        const bx = col * gw, by = row * gh;
        const wave = Math.sin(tick * 0.018 + col * 0.5 + row * 0.3) * 0.5 + 0.5;
        const a = wave * 0.12 + 0.03;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.restore();
      }
    }

    // ── 2. CONNECTING LINES BETWEEN NEARBY PARTICLES ─
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - d / 120) * 0.18;
          ctx.strokeStyle = '#a78bfa';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // ── 3. PARTICLES ──────────────────────────
    particles.forEach(p => { p.update(); p.draw(); });

    // ── 4. FLOWING DATA STREAMS ───────────────
    streams.forEach(s => {
      s.y += s.speed;
      if (s.y > 1) s.y = -s.len;
      s.charTimer++;
      if (s.charTimer > 18) { s.currentChar = s.char(); s.charTimer = 0; }

      const sx = s.x * W;
      const sy1 = s.y * H;
      const sy2 = sy1 + s.len * H;

      const grad = ctx.createLinearGradient(sx, sy1, sx, sy2);
      grad.addColorStop(0, 'rgba(245,158,11,0)');
      grad.addColorStop(0.5, 'rgba(245,158,11,' + s.alpha + ')');
      grad.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, sy1);
      ctx.lineTo(sx, sy2);
      ctx.stroke();

      // floating char at tip
      ctx.font = '9px DM Mono, monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.globalAlpha = s.alpha * 1.4;
      ctx.fillText(s.currentChar, sx - 4, sy2);
      ctx.restore();
    });

    // ── 5. HEXAGONS ───────────────────────────
    hexes.forEach(h => {
      h.y += h.speed;
      if (h.y > 1.1) h.y = -0.1;
      h.rot += h.rotSpeed;
      const hx = h.x * W, hy = h.y * H;
      ctx.save();
      ctx.globalAlpha = h.alpha + Math.sin(tick * 0.02 + h.phase) * 0.02;
      ctx.strokeStyle = Math.random() > 0.98 ? '#a78bfa' : '#f59e0b';
      ctx.lineWidth = 0.8;
      drawHex(ctx, hx, hy, h.size, h.rot);
      ctx.stroke();
      // inner hex
      ctx.globalAlpha = h.alpha * 0.4;
      drawHex(ctx, hx, hy, h.size * 0.55, h.rot + Math.PI / 6);
      ctx.stroke();
      ctx.restore();
    });

    // ── 6. ORBIT RINGS ────────────────────────
    rings.forEach(r => {
      r.phase += r.speed;
      const rx = r.x * W, ry = r.y * H;
      ctx.save();
      ctx.globalAlpha = r.alpha;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 0.6;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(rx, ry, r.r, 0, Math.PI * 2);
      ctx.stroke();
      // dot on ring
      const dotX = rx + r.r * Math.cos(r.phase);
      const dotY = ry + r.r * Math.sin(r.phase);
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      // second dot opposite
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(rx + r.r * Math.cos(r.phase + Math.PI), ry + r.r * Math.sin(r.phase + Math.PI), 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // ── 7. FLOWING SINE WAVES (horizontal) ───
    for (let wi = 0; wi < 4; wi++) {
      const yBase   = H * (0.2 + wi * 0.2);
      const amp     = 18 + wi * 10;
      const freq    = 0.008 - wi * 0.001;
      const speed   = tick * (0.012 + wi * 0.004);
      const alpha   = 0.04 + wi * 0.015;
      const color   = wi % 2 === 0 ? '#f59e0b' : '#a78bfa';

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = yBase + Math.sin(x * freq + speed) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  // re-resize when page height changes
  setInterval(() => {
    const newH = document.documentElement.scrollHeight;
    if (newH !== H) resize();
  }, 1000);

  frame();
})();

// ── HERO BAR CHART (separate small canvas) ─
(function initHeroBg() {
  const canvas = document.getElementById('heroChart');
  if (!canvas) return;
  const ctx2 = canvas.getContext('2d');
  let W2, H2;
  const bars2 = Array.from({length: 28}, () => ({ h: Math.random() * 0.55 + 0.1, target: Math.random() * 0.55 + 0.1, speed: 0.004 + Math.random() * 0.006 }));
  function resize2() { W2 = canvas.width = canvas.offsetWidth; H2 = canvas.height = canvas.offsetHeight; }
  resize2(); window.addEventListener('resize', resize2);
  function draw2() {
    ctx2.clearRect(0, 0, W2, H2);
    const bw = W2 / bars2.length, gap = bw * 0.28;
    bars2.forEach((b, i) => {
      b.h += (b.target - b.h) * b.speed;
      if (Math.abs(b.h - b.target) < 0.005) b.target = Math.random() * 0.6 + 0.1;
      const x = i * bw + gap / 2, bh = b.h * H2, y = H2 - bh;
      const g = ctx2.createLinearGradient(x, y, x, H2);
      g.addColorStop(0, 'rgba(245,158,11,0.45)'); g.addColorStop(1, 'rgba(167,139,250,0.05)');
      ctx2.fillStyle = g; ctx2.beginPath(); ctx2.roundRect(x, y, bw - gap, bh, [3,3,0,0]); ctx2.fill();
    });
    requestAnimationFrame(draw2);
  }
  draw2();
})();

// ── TYPEWRITER ────────────────────────────────
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['Data Scientist','ML Engineer','Data Analyst','Python Developer'];
  let wi = 0, ci = 0, del = false;
  function tick() {
    const w = words[wi];
    if (!del) { el.textContent = w.slice(0, ++ci); if (ci === w.length) { del = true; setTimeout(tick, 1800); return; } }
    else { el.textContent = w.slice(0, --ci); if (ci === 0) { del = false; wi = (wi+1) % words.length; } }
    setTimeout(tick, del ? 55 : 90);
  }
  tick();
})();

// ── COUNTER ANIMATION ─────────────────────────
function animateCount(el, target, dec) {
  const dur = 1400, start = performance.now();
  function step(now) {
    const p = Math.min((now-start)/dur,1), e = 1-Math.pow(1-p,3);
    el.textContent = (e*target).toFixed(dec);
    if (p<1) requestAnimationFrame(step); else el.textContent = target.toFixed(dec);
  }
  requestAnimationFrame(step);
}

// ── MINI CHARTS ───────────────────────────────
function drawBarChart(canvas) {
  const ctx = canvas.getContext('2d'), vals = canvas.dataset.bars.split(',').map(Number);
  const max = Math.max(...vals), W = canvas.width, H = canvas.height, bw = W/vals.length;
  ctx.clearRect(0,0,W,H);
  vals.forEach((v,i) => {
    const bh=(v/max)*H*0.85, x=i*bw+2, y=H-bh, g=ctx.createLinearGradient(x,y,x,H);
    g.addColorStop(0,'#f59e0b'); g.addColorStop(1,'rgba(245,158,11,0.1)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(x,y,bw-4,bh,[2,2,0,0]); ctx.fill();
  });
}
function drawLineChart(canvas) {
  const ctx = canvas.getContext('2d'), vals = canvas.dataset.vals.split(',').map(Number);
  const min=Math.min(...vals), max=Math.max(...vals), W=canvas.width, H=canvas.height, pad=4;
  const px=i=>pad+(i/(vals.length-1))*(W-pad*2), py=v=>H-pad-((v-min)/(max-min))*(H-pad*2);
  ctx.clearRect(0,0,W,H);
  const fg=ctx.createLinearGradient(0,0,0,H); fg.addColorStop(0,'rgba(245,158,11,0.3)'); fg.addColorStop(1,'rgba(245,158,11,0)');
  ctx.beginPath(); vals.forEach((v,i)=>i===0?ctx.moveTo(px(i),py(v)):ctx.lineTo(px(i),py(v)));
  ctx.lineTo(px(vals.length-1),H); ctx.lineTo(px(0),H); ctx.closePath(); ctx.fillStyle=fg; ctx.fill();
  ctx.beginPath(); vals.forEach((v,i)=>i===0?ctx.moveTo(px(i),py(v)):ctx.lineTo(px(i),py(v)));
  ctx.strokeStyle='#f59e0b'; ctx.lineWidth=1.5; ctx.stroke();
}

// ── INTERSECTION OBSERVER ─────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(cel => animateCount(cel, parseFloat(cel.dataset.count), parseInt(cel.dataset.dec||'0')));
    el.querySelectorAll('.sbar').forEach(bar => { const f=bar.querySelector('.sbar__fill'); if(f) f.style.width=(bar.dataset.pct||0)+'%'; });
    el.querySelectorAll('.mini-bar-canvas').forEach(drawBarChart);
    el.querySelectorAll('.mini-line-canvas').forEach(drawLineChart);
    io.unobserve(el);
  });
}, { threshold: 0.12 });

const dashCard = document.getElementById('dashCard');
if (dashCard) io.observe(dashCard);
document.querySelectorAll('.reveal-up, .skills__bars, .learning__grid, .pcard').forEach(el => io.observe(el));
document.querySelectorAll('.section__label, .heading').forEach(el => { el.classList.add('reveal-up'); io.observe(el); });