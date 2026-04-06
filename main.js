'use strict';

const $ = id => document.getElementById(id);

let userName = '';
let noEscapeCount = 0;
let noBtnInitialised = false;

function showScreen(id) {
  const el = $(id);
  el.classList.remove('fade-out');
  el.classList.add('active');
}

function hideScreen(id, cb) {
  const el = $(id);
  el.classList.add('fade-out');
  setTimeout(() => {
    el.classList.remove('active', 'fade-out');
    if (cb) cb();
  }, 950);
}

function initSparkles() {
  const container = $('particles-bg');
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const size = 2 + Math.random() * 4;
    s.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      width:  ${size}px;
      height: ${size}px;
      animation-duration: ${2 + Math.random() * 3.5}s;
      animation-delay:    ${Math.random() * 5}s;
      background: hsl(${338 + Math.random() * 25}, 75%, ${72 + Math.random() * 18}%);
    `;
    container.appendChild(s);
  }
}

function initFallingPetals() {
  const emojis = ['🌸', '🌺', '✿'];
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'falling-petal';
    p.textContent = emojis[i % emojis.length];
    p.style.cssText = `
      left:              ${Math.random() * 100}%;
      animation-duration:${7 + Math.random() * 7}s;
      animation-delay:   ${Math.random() * 10}s;
      font-size:         ${0.7 + Math.random() * 0.6}rem;
    `;
    $('particles-bg').appendChild(p);
  }
}

function startFlow() {
  setTimeout(() => {
    hideScreen('s1', () => showScreen('s2'));
  }, 2700);
}

function bindNameInput() {
  const input   = $('nameInput');
  const wrapper = document.querySelector('.input-wrapper');
  const btn     = $('enterBtn');

  input.addEventListener('focus', () => wrapper.classList.add('focused'));
  input.addEventListener('blur',  () => wrapper.classList.remove('focused'));

  btn.addEventListener('click', submitName);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitName();
  });
}

function submitName() {
  const raw = $('nameInput').value.trim();
  if (!raw) {
    const input = $('nameInput');
    input.style.transition = 'transform 0.08s ease';
    let n = 0;
    const shake = setInterval(() => {
      input.style.transform = n % 2 === 0 ? 'translateX(6px)' : 'translateX(-6px)';
      n++;
      if (n > 6) { clearInterval(shake); input.style.transform = ''; }
    }, 80);
    return;
  }

  userName = raw.charAt(0).toUpperCase() + raw.slice(1);

  hideScreen('s2', () => {
    $('greetingLine').innerHTML =
      `Oh hi, <span class="name-highlight">${userName}</span> ✨`;
    showScreen('s3');
    setTimeout(transitionToDark, 2300);
  });
}

function transitionToDark() {
  hideScreen('s3');

  const overlay = $('darkOverlay');
  setTimeout(() => overlay.classList.add('visible'), 400);

  setTimeout(() => {
    showScreen('s4');
    bloomFlower();
  }, 1700);
}

function bloomFlower() {
  const wrap = $('flowerWrap');
  wrap.classList.add('show');

  delay(200,  () => $('stem').classList.add('grow'));

  delay(800,  () => $('leafLeft').classList.add('show'));
  delay(1050, () => $('leafRight').classList.add('show'));

  const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  petalAngles.forEach((angle, i) => {
    delay(1250 + i * 165, () => {
      const petal = document.getElementById(`petal-${i}`);
      if (!petal) return;
      petal.style.transform = `rotate(${angle}deg) scale(1)`;
      petal.classList.add('bloom');
    });
  });

  delay(2640, () => $('cOuter').classList.add('bloom'));
  delay(2780, () => $('cMid').classList.add('bloom'));
  delay(2900, () => $('cCore').classList.add('bloom'));

  delay(3200, () => $('confessionText').classList.add('show'));

  delay(3750, () => {
    $('btnGroup').classList.add('show');
    initNoButton();
  });
}

const TAUNTS = [
  'No 😝', 'Nope!', 'Catch me~', 'Hehe 👀', 'Not today!',
  'Try harder 💨', 'Boo!', 'Nya~', 'Almost! 😜', 'No no no',
  'Hahaha', "Can't catch me", 'Zoom!', '...nah', 'Escape!'
];

function initNoButton() {
  if (noBtnInitialised) return;
  noBtnInitialised = true;

  const noBtn = $('noBtn');
  positionNoBtn();

  noBtn.addEventListener('mouseenter', runAway);
  noBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    runAway();
  }, { passive: false });

  noBtn.addEventListener('click', onNoClick);
}

function positionNoBtn() {
  const noBtn  = $('noBtn');
  const yesBtn = $('yesBtn');
  const rect   = yesBtn.getBoundingClientRect();

  const isNarrow = window.innerWidth < 500;
  if (isNarrow) {
    const btnW = noBtn.offsetWidth || 130;
    noBtn.style.left = `${rect.left + rect.width / 2 - btnW / 2}px`;
    noBtn.style.top  = `${rect.bottom + 16}px`;
  } else {
    noBtn.style.left = `${rect.right + 24}px`;
    noBtn.style.top  = `${rect.top}px`;
  }
  noBtn.style.opacity = '1';
}

function runAway() {
  noEscapeCount++;
  const noBtn = $('noBtn');

  if (noEscapeCount > 14) {
    noBtn.textContent = '...ok fine 😤';
    noBtn.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      noBtn.style.opacity = '0';
      noBtn.style.pointerEvents = 'none';
    }, 700);
    return;
  }

  const w      = noBtn.offsetWidth  || 130;
  const h      = noBtn.offsetHeight || 52;
  const margin = 20;
  const maxX   = window.innerWidth  - w - margin;
  const maxY   = window.innerHeight - h - margin;

  const rx = margin + Math.random() * Math.max(0, maxX - margin);
  const ry = margin + Math.random() * Math.max(0, maxY - margin);

  const speed = Math.max(0.07, 0.2 - noEscapeCount * 0.008);
  noBtn.style.transition = `left ${speed}s ease, top ${speed}s ease`;
  noBtn.style.left = `${rx}px`;
  noBtn.style.top  = `${ry}px`;

  noBtn.textContent = TAUNTS[noEscapeCount - 1] || 'No';
}

function onNoClick() {
  const noBtn = $('noBtn');
  noBtn.style.opacity = '0';
  noBtn.style.pointerEvents = 'none';
}

function bindYesButton() {
  $('yesBtn').addEventListener('click', showSurprise);
}

function showSurprise() {
  hideScreen('s4', () => {
    showScreen('s5');
    launchConfetti();
    spawnFloatingHearts();
    delay(400, () => $('surpriseInner').classList.add('show'));
  });
}

function launchConfetti() {
  const canvas = $('confettiCanvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const COLORS = [
    '#e8637a', '#f5b8c4', '#d4a85a', '#fce8ed',
    '#c0394f', '#f2a0b0', '#f0c878', '#ee8fa1'
  ];

  const particles = Array.from({ length: 140 }, () => ({
    x:     Math.random() * canvas.width,
    y:     -20 - Math.random() * canvas.height,
    r:     2 + Math.random() * 5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx:    (Math.random() - 0.5) * 2.2,
    vy:    1.2 + Math.random() * 3,
    angle: Math.random() * 360,
    va:    (Math.random() - 0.5) * 4,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI / 180);
      ctx.globalAlpha = 0.88;
      ctx.fillStyle   = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      }

      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.va;

      if (p.y > canvas.height + 10) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    }

    frame++;
    if (frame < 360) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  draw();
}

function spawnFloatingHearts() {
  const container = $('floatingHearts');
  const emojis = ['💕', '💖', '🌹', '✨', '💝', '💗', '🌸', '💓', '🥀', '💞'];

  for (let i = 0; i < 20; i++) {
    const h = document.createElement('div');
    h.className = 'fh';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.cssText = `
      left:               ${Math.random() * 100}%;
      animation-duration: ${4.5 + Math.random() * 6}s;
      animation-delay:    ${Math.random() * 5}s;
      font-size:          ${0.9 + Math.random() * 1.3}rem;
    `;
    container.appendChild(h);
  }
}

window.addEventListener('resize', () => {
  const confetti = $('confettiCanvas');
  if (confetti) {
    confetti.width  = window.innerWidth;
    confetti.height = window.innerHeight;
  }
  if ($('btnGroup').classList.contains('show') && noEscapeCount === 0) {
    positionNoBtn();
  }
});

function delay(ms, fn) {
  return setTimeout(fn, ms);
}

document.addEventListener('DOMContentLoaded', () => {
  initSparkles();
  initFallingPetals();
  bindNameInput();
  bindYesButton();
  startFlow();
});
