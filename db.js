// Storage abstraction layer.
// Currently backed by localStorage.
// Replace method bodies with fetch() calls to migrate to a real backend.

const DB = (() => {
  const KEY = 'hamster_worlds';

  function _load() {
    try { return JSON.parse(SafeStorage.get(KEY)) || []; }
    catch { return []; }
  }

  function _save(worlds) {
    SafeStorage.set(KEY, JSON.stringify(worlds));
  }

  function getAllWorlds() { return _load(); }

  function getWorld(id) {
    return _load().find((w) => w.id === id) || null;
  }

  function createWorld({ name, speed, spins }) {
    const worlds = _load();
    const world = {
      id: Date.now().toString(36),
      name, speed, spins,
      totalSpins: 0,
      createdAt: Date.now(),
    };
    worlds.push(world);
    _save(worlds);
    return world;
  }

  function updateWorld(id, fields) {
    const worlds = _load();
    const idx = worlds.findIndex((w) => w.id === id);
    if (idx === -1) return null;
    Object.assign(worlds[idx], fields);
    _save(worlds);
    return worlds[idx];
  }

  function deleteWorld(id) {
    _save(_load().filter((w) => w.id !== id));
  }

  function addSpins(id, count) {
    const worlds = _load();
    const idx = worlds.findIndex((w) => w.id === id);
    if (idx === -1) return 0;
    worlds[idx].totalSpins = (worlds[idx].totalSpins || 0) + count;
    _save(worlds);
    return worlds[idx].totalSpins;
  }

  function getTotalSpins(id) {
    const w = getWorld(id);
    return w ? (w.totalSpins || 0) : 0;
  }

  return { getAllWorlds, getWorld, createWorld, updateWorld, deleteWorld, addSpins, getTotalSpins };
})();
