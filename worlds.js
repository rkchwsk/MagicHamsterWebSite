const grid = document.getElementById('worlds-grid');
const overlay = document.getElementById('create-overlay');
const btnOpen = document.getElementById('btn-open-create');
const btnCancel = document.getElementById('btn-cancel-create');
const btnSave = document.getElementById('btn-save-world');
const formTitle = document.querySelector('.create-form h2');
const nameInput = document.getElementById('world-name');
const speedInput = document.getElementById('world-speed');
const speedVal = document.getElementById('speed-val');
const spinsInput = document.getElementById('world-spins');

let editingId = null;
const UPGRADE_KEY = 'hamster_speed_upgrade';
const speedUpgradeActive = () => localStorage.getItem(UPGRADE_KEY) === '1';

// On return from play page, save accumulated spins
(function handleReturnSpins() {
  const params = new URLSearchParams(window.location.search);
  const worldId = params.get('returnId');
  const added = parseInt(params.get('addedSpins'), 10);
  if (worldId && added > 0) {
    DB.addSpins(worldId, added);
    history.replaceState(null, '', 'worlds.html');
  }
})();

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function generateBackground(id) {
  const h = hashStr(id);
  const hue1 = h % 360;
  const hue2 = (h * 7 + 120) % 360;
  const angle = (h * 3) % 360;
  const sat = 40 + (h % 25);
  const light = 78 + (h % 10);
  const size = 20 + (h % 30);
  const c1 = `hsl(${hue1}, ${sat}%, ${light}%)`;
  const c2 = `hsl(${hue2}, ${sat}%, ${light + 5}%)`;
  const cLine = `hsl(${hue1}, ${sat + 10}%, ${light - 12}%)`;
  const cBg = `hsl(${hue2}, ${sat - 10}%, ${light + 8}%)`;
  const t = h % 8;
  if (t === 0) return `repeating-linear-gradient(${angle}deg, ${c1}, ${c1} ${size}px, ${c2} ${size}px, ${c2} ${size * 2}px)`;
  if (t === 1) return `repeating-linear-gradient(0deg, ${cLine} 0px, ${cLine} 2px, ${cBg} 2px, ${cBg} ${size}px), repeating-linear-gradient(90deg, ${cLine} 0px, ${cLine} 2px, transparent 2px, transparent ${size}px)`;
  if (t === 2) return `radial-gradient(circle, ${cLine} 3px, transparent 3px), radial-gradient(circle, ${cLine} 3px, transparent 3px)`;
  if (t === 3) return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  if (t === 4) return `linear-gradient(135deg, ${cLine} 25%, transparent 25%), linear-gradient(225deg, ${cLine} 25%, transparent 25%), linear-gradient(315deg, ${cLine} 25%, transparent 25%), linear-gradient(45deg, ${cLine} 25%, transparent 25%)`;
  if (t === 5) return `repeating-linear-gradient(${angle}deg, ${c1} 0px, ${c1} 4px, ${cBg} 4px, ${cBg} 8px, ${c2} 8px, ${c2} 12px, ${cBg} 12px, ${cBg} 16px)`;
  if (t === 6) return `repeating-linear-gradient(${angle}deg, ${c1}, ${c2} ${size * 2}px, ${c1} ${size * 4}px)`;
  return `repeating-linear-gradient(45deg, transparent, transparent ${size}px, ${cLine} ${size}px, ${cLine} ${size + 3}px), repeating-linear-gradient(-45deg, transparent, transparent ${size}px, ${c2} ${size}px, ${c2} ${size + 3}px), ${cBg}`;
}

function getBackgroundSize(id) {
  const h = hashStr(id);
  const size = 20 + (h % 30);
  const t = h % 8;
  if (t === 2) return `${size}px ${size}px, ${size}px ${size}px`;
  if (t === 4) { const s = size + 10; return `${s}px ${s}px, ${s}px ${s}px, ${s}px ${s}px, ${s}px ${s}px`; }
  return 'auto';
}

function getBackgroundPosition(id) {
  const h = hashStr(id);
  const size = 20 + (h % 30);
  const t = h % 8;
  if (t === 2) { const half = Math.round(size / 2); return `0 0, ${half}px ${half}px`; }
  if (t === 4) { const s = size + 10; const hs = Math.round(s / 2); return `0 0, 0 ${hs}px, ${hs}px ${hs}px, ${hs}px 0`; }
  return 'auto';
}

function buildPlayUrl(world) {
  const params = new URLSearchParams({
    id: world.id,
    speed: world.speed,
    spins: world.spins,
    totalSpins: world.totalSpins || 0,
    bg: world.id,
  });
  return 'play.html?' + params.toString();
}

function deleteWorld(id) {
  DB.deleteWorld(id);
  renderWorlds();
}

function editWorld(id) {
  const world = DB.getWorld(id);
  if (!world) return;
  editingId = id;
  formTitle.textContent = I18N.t('editWorld');
  btnSave.textContent = I18N.t('save');
  nameInput.value = world.name;
  applySpeedMax();
  speedInput.value = world.speed;
  speedVal.textContent = world.speed;
  spinsInput.value = world.spins;
  overlay.classList.add('visible');
}

function renderWorlds() {
  const worlds = DB.getAllWorlds();
  grid.innerHTML = '';

  if (worlds.length === 0) {
    grid.innerHTML = `<p style="color:#666;font-size:1.1rem;">${I18N.t('noWorlds')}</p>`;
    return;
  }

  worlds.forEach((world) => {
    const card = document.createElement('div');
    card.className = 'world-card';
    const bg = generateBackground(world.id);
    const bgSize = getBackgroundSize(world.id);
    const bgPos = getBackgroundPosition(world.id);
    const playUrl = buildPlayUrl(world);
    const total = world.totalSpins || 0;

    card.innerHTML = `
      <div class="world-card-top" style="background:${bg};background-size:${bgSize};background-position:${bgPos}">
        <img src="main_hamster.jpg" alt="${world.name}" />
        <span class="world-card-name-top">${world.name}</span>
      </div>
      <div class="world-card-strip"></div>
      <div class="world-card-bottom">
        <span class="world-card-name">${world.name}</span>
        <span class="world-card-info">${I18N.t('spinsPerClick')}: ${world.spins} · ${I18N.t('speedLabel')}: ${world.speed} · ${I18N.t('total')}: ${total}</span>
        <a href="${playUrl}" class="btn-play-world">${I18N.t('play')}</a>
        <button class="btn-edit-world" data-id="${world.id}">${I18N.t('edit')}</button>
        <button class="btn-delete-world" data-id="${world.id}">${I18N.t('delete')}</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.btn-delete-world').forEach((btn) => {
    btn.addEventListener('click', () => deleteWorld(btn.dataset.id));
  });
  grid.querySelectorAll('.btn-edit-world').forEach((btn) => {
    btn.addEventListener('click', () => editWorld(btn.dataset.id));
  });
}

function applySpeedMax() {
  speedInput.max = speedUpgradeActive() ? 1000 : 100;
}

function openForm() {
  editingId = null;
  formTitle.textContent = I18N.t('newWorld');
  btnSave.textContent = I18N.t('create');
  nameInput.value = '';
  applySpeedMax();
  speedInput.value = 50;
  speedVal.textContent = '50';
  spinsInput.value = 2;
  overlay.classList.add('visible');
}

function closeForm() {
  editingId = null;
  overlay.classList.remove('visible');
}

function saveWorld() {
  const name = nameInput.value.trim() || I18N.t('unnamedWorld');
  const speed = parseInt(speedInput.value, 10);
  const spins = Math.max(1, Math.min(1000, parseInt(spinsInput.value, 10) || 2));

  if (editingId) {
    DB.updateWorld(editingId, { name, speed, spins });
  } else {
    DB.createWorld({ name, speed, spins });
  }
  closeForm();
  renderWorlds();
}

btnOpen.addEventListener('click', openForm);
btnCancel.addEventListener('click', closeForm);
btnSave.addEventListener('click', saveWorld);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeForm(); });
speedInput.addEventListener('input', () => { speedVal.textContent = speedInput.value; });

renderWorlds();
