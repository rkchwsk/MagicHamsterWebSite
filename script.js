const logo = document.querySelector('.floating-logo');
const logoImage = document.querySelector('.floating-logo img');
const spinCountEl = document.getElementById('spin-count');
const speedRange = document.getElementById('speed-range');
const btnExit = document.getElementById('btn-exit');

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

function generateBackground(id) {
  const h = hashStr(id);
  const hue1 = h % 360, hue2 = (h * 7 + 120) % 360;
  const angle = (h * 3) % 360, sat = 40 + (h % 25), light = 78 + (h % 10), size = 20 + (h % 30);
  const c1 = `hsl(${hue1},${sat}%,${light}%)`, c2 = `hsl(${hue2},${sat}%,${light + 5}%)`;
  const cLine = `hsl(${hue1},${sat + 10}%,${light - 12}%)`, cBg = `hsl(${hue2},${sat - 10}%,${light + 8}%)`;
  const t = h % 8;
  if (t === 0) return `repeating-linear-gradient(${angle}deg,${c1},${c1} ${size}px,${c2} ${size}px,${c2} ${size * 2}px)`;
  if (t === 1) return `repeating-linear-gradient(0deg,${cLine} 0px,${cLine} 2px,${cBg} 2px,${cBg} ${size}px),repeating-linear-gradient(90deg,${cLine} 0px,${cLine} 2px,transparent 2px,transparent ${size}px)`;
  if (t === 2) return `radial-gradient(circle,${cLine} 3px,transparent 3px),radial-gradient(circle,${cLine} 3px,transparent 3px)`;
  if (t === 3) return `linear-gradient(${angle}deg,${c1},${c2})`;
  if (t === 4) return `linear-gradient(135deg,${cLine} 25%,transparent 25%),linear-gradient(225deg,${cLine} 25%,transparent 25%),linear-gradient(315deg,${cLine} 25%,transparent 25%),linear-gradient(45deg,${cLine} 25%,transparent 25%)`;
  if (t === 5) return `repeating-linear-gradient(${angle}deg,${c1} 0px,${c1} 4px,${cBg} 4px,${cBg} 8px,${c2} 8px,${c2} 12px,${cBg} 12px,${cBg} 16px)`;
  if (t === 6) return `repeating-linear-gradient(${angle}deg,${c1},${c2} ${size * 2}px,${c1} ${size * 4}px)`;
  return `repeating-linear-gradient(45deg,transparent,transparent ${size}px,${cLine} ${size}px,${cLine} ${size + 3}px),repeating-linear-gradient(-45deg,transparent,transparent ${size}px,${c2} ${size}px,${c2} ${size + 3}px),${cBg}`;
}

function getBackgroundSize(id) {
  const h = hashStr(id), size = 20 + (h % 30), t = h % 8;
  if (t === 2) return `${size}px ${size}px,${size}px ${size}px`;
  if (t === 4) { const s = size + 10; return `${s}px ${s}px,${s}px ${s}px,${s}px ${s}px,${s}px ${s}px`; }
  return 'auto';
}

function getBackgroundPosition(id) {
  const h = hashStr(id), size = 20 + (h % 30), t = h % 8;
  if (t === 2) { const hf = Math.round(size / 2); return `0 0,${hf}px ${hf}px`; }
  if (t === 4) { const s = size + 10, hs = Math.round(s / 2); return `0 0,0 ${hs}px,${hs}px ${hs}px,${hs}px 0`; }
  return 'auto';
}

function getWorldSettings() {
  const p = new URLSearchParams(window.location.search);
  const speed = p.get('speed'), spins = p.get('spins');
  if (speed === null && spins === null) return null;
  return {
    id: p.get('id') || null,
    speed: parseInt(speed, 10) || 50,
    spins: parseInt(spins, 10) || 2,
    totalSpins: parseInt(p.get('totalSpins'), 10) || 0,
    bg: p.get('bg') || null,
  };
}

if (logo && logoImage) {
  const FASTEST_MS = 200, SLOWEST_MS = 3000;
  const world = getWorldSettings();

  if (world && world.bg) {
    document.body.style.background = generateBackground(world.bg);
    document.body.style.backgroundSize = getBackgroundSize(world.bg);
    document.body.style.backgroundPosition = getBackgroundPosition(world.bg);
  }

  const spinRotations = world ? world.spins : 2;
  const spinDegrees = spinRotations * 360;
  const spinDurationMs = Math.min(220 * spinRotations, 5000);

  let spinCount = world ? world.totalSpins : 0;
  let sessionSpins = 0;
  let speedFactor = world ? world.speed / 100 : 0.5;
  let spinning = false;

  if (spinCountEl) spinCountEl.textContent = spinCount;
  if (speedRange) speedRange.value = Math.round(speedFactor * 100);

  function updateExitLink() {
    if (!btnExit || !world || !world.id) return;
    const params = new URLSearchParams({ returnId: world.id, addedSpins: sessionSpins });
    btnExit.href = 'worlds.html?' + params.toString();
  }
  updateExitLink();

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const getTravelRange = () => {
    const mn = FASTEST_MS + (SLOWEST_MS - FASTEST_MS) * (1 - speedFactor) * 0.7;
    const mx = FASTEST_MS + (SLOWEST_MS - FASTEST_MS) * (1 - speedFactor);
    return { min: mn, max: mx };
  };

  const getBounds = () => ({
    maxX: Math.max(0, window.innerWidth - logo.offsetWidth),
    maxY: Math.max(0, window.innerHeight - logo.offsetHeight),
  });

  const flyToRandomSpot = () => {
    const { maxX, maxY } = getBounds();
    const nextX = randomInt(0, maxX), nextY = randomInt(0, maxY);
    const { min, max } = getTravelRange();
    const duration = randomInt(min, max);
    logo.style.transitionDuration = `${duration}ms`;
    logo.style.transform = `translate(${nextX}px, ${nextY}px)`;
    setTimeout(flyToRandomSpot, duration);
  };

  const resetAfterResize = () => {
    const { maxX, maxY } = getBounds();
    const m = logo.style.transform.match(/translate\((\d+)px,\s*(\d+)px\)/);
    if (!m) return;
    logo.style.transform = `translate(${Math.min(+m[1], maxX)}px, ${Math.min(+m[2], maxY)}px)`;
  };

  logo.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    logoImage.animate(
      [{ transform: 'rotate(0deg)' }, { transform: `rotate(${spinDegrees}deg)` }],
      { duration: spinDurationMs, easing: 'ease-in-out' }
    ).onfinish = () => { spinning = false; };

    sessionSpins += spinRotations;
    spinCount += spinRotations;
    if (spinCountEl) spinCountEl.textContent = spinCount;
    updateExitLink();
  });

  if (speedRange) {
    speedRange.addEventListener('input', () => { speedFactor = speedRange.value / 100; });
  }

  window.addEventListener('resize', resetAfterResize);
  flyToRandomSpot();
}
