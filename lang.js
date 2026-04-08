const I18N = (() => {
  const KEY = 'hamster_lang';

  const translations = {
    ru: {
      siteTitle: 'Волшебный Хомячок',
      play: 'Играть',
      settings: 'Настройки',
      market: 'Рынок',
      chooseWorld: 'Выбери мир',
      createNewWorld: 'Создать новый мир',
      noWorlds: 'Пока нет миров. Создай первый!',
      newWorld: 'Новый мир',
      editWorld: 'Редактировать мир',
      worldName: 'Название мира',
      worldNamePlaceholder: 'Мой мир',
      hamsterSpeed: 'Скорость хомячка',
      spinsOnHit: 'Вращений при попадании',
      create: 'Создать',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      spinsPerClick: 'вращений за клик',
      speedLabel: 'скорость',
      total: 'всего',
      unnamedWorld: 'Безымянный мир',
      welcome: 'Добро Пожаловать',
      welcomeSub: 'в Волшебный Хомячок!',
      spins: 'вращения',
      speed: 'Скорость',
      saveAndExit: 'Сохранить и выйти',
      language: 'Язык',
      settingsTitle: 'Настройки',
      back: 'Назад',
    },
    en: {
      siteTitle: 'Magic Hamster',
      play: 'Play',
      settings: 'Settings',
      market: 'Market',
      chooseWorld: 'Choose a world',
      createNewWorld: 'Create new world',
      noWorlds: 'No worlds yet. Create your first!',
      newWorld: 'New world',
      editWorld: 'Edit world',
      worldName: 'World name',
      worldNamePlaceholder: 'My world',
      hamsterSpeed: 'Hamster speed',
      spinsOnHit: 'Spins on hit',
      create: 'Create',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      spinsPerClick: 'spins/click',
      speedLabel: 'speed',
      total: 'total',
      unnamedWorld: 'Unnamed world',
      welcome: 'Welcome',
      welcomeSub: 'to Magic Hamster!',
      spins: 'spins',
      speed: 'Speed',
      saveAndExit: 'Save & Exit',
      language: 'Language',
      settingsTitle: 'Settings',
      back: 'Back',
    },
    nl: {
      siteTitle: 'Magische Hamster',
      play: 'Spelen',
      settings: 'Instellingen',
      market: 'Markt',
      chooseWorld: 'Kies een wereld',
      createNewWorld: 'Nieuwe wereld maken',
      noWorlds: 'Nog geen werelden. Maak je eerste!',
      newWorld: 'Nieuwe wereld',
      editWorld: 'Wereld bewerken',
      worldName: 'Wereldnaam',
      worldNamePlaceholder: 'Mijn wereld',
      hamsterSpeed: 'Hamstersnelheid',
      spinsOnHit: 'Draaiingen bij treffer',
      create: 'Maken',
      save: 'Opslaan',
      cancel: 'Annuleren',
      delete: 'Verwijderen',
      edit: 'Bewerken',
      spinsPerClick: 'draaiingen/klik',
      speedLabel: 'snelheid',
      total: 'totaal',
      unnamedWorld: 'Naamloze wereld',
      welcome: 'Welkom',
      welcomeSub: 'bij Magische Hamster!',
      spins: 'draaiingen',
      speed: 'Snelheid',
      saveAndExit: 'Opslaan & Afsluiten',
      language: 'Taal',
      settingsTitle: 'Instellingen',
      back: 'Terug',
    },
    es: {
      siteTitle: 'Hámster Mágico',
      play: 'Jugar',
      settings: 'Ajustes',
      market: 'Mercado',
      chooseWorld: 'Elige un mundo',
      createNewWorld: 'Crear nuevo mundo',
      noWorlds: '¡Aún no hay mundos. Crea el primero!',
      newWorld: 'Nuevo mundo',
      editWorld: 'Editar mundo',
      worldName: 'Nombre del mundo',
      worldNamePlaceholder: 'Mi mundo',
      hamsterSpeed: 'Velocidad del hámster',
      spinsOnHit: 'Giros al golpear',
      create: 'Crear',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      spinsPerClick: 'giros/clic',
      speedLabel: 'velocidad',
      total: 'total',
      unnamedWorld: 'Mundo sin nombre',
      welcome: 'Bienvenido',
      welcomeSub: '¡al Hámster Mágico!',
      spins: 'giros',
      speed: 'Velocidad',
      saveAndExit: 'Guardar y Salir',
      language: 'Idioma',
      settingsTitle: 'Ajustes',
      back: 'Atrás',
    },
  };

  function getLang() {
    return localStorage.getItem(KEY) || 'ru';
  }

  function setLang(lang) {
    localStorage.setItem(KEY, lang);
  }

  function t(key) {
    const lang = getLang();
    const dict = translations[lang] || translations.ru;
    return dict[key] || translations.ru[key] || key;
  }

  function applyToPage() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.title = t('siteTitle');
  }

  return { getLang, setLang, t, applyToPage, translations };
})();
