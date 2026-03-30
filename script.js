const logo = document.querySelector('.floating-logo');
const logoImage = document.querySelector('.floating-logo img');
const spinCountEl = document.getElementById('spin-count');
const speedRange = document.getElementById('speed-range');

if (logo && logoImage) {
  const FASTEST_MS = 200;
  const SLOWEST_MS = 3000;

  let spinCount = 0;
  let speedFactor = 0.5;
  let flyTimer = null;

  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getTravelRange = () => {
    const min = FASTEST_MS + (SLOWEST_MS - FASTEST_MS) * (1 - speedFactor) * 0.7;
    const max = FASTEST_MS + (SLOWEST_MS - FASTEST_MS) * (1 - speedFactor);
    return { min, max };
  };

  const getBounds = () => {
    const width = logo.offsetWidth;
    const height = logo.offsetHeight;

    return {
      maxX: Math.max(0, window.innerWidth - width),
      maxY: Math.max(0, window.innerHeight - height),
    };
  };

  const flyToRandomSpot = () => {
    const { maxX, maxY } = getBounds();
    const nextX = randomInt(0, maxX);
    const nextY = randomInt(0, maxY);
    const { min, max } = getTravelRange();
    const duration = randomInt(min, max);

    logo.style.transitionDuration = `${duration}ms`;
    logo.style.transform = `translate(${nextX}px, ${nextY}px)`;

    flyTimer = window.setTimeout(flyToRandomSpot, duration);
  };

  const resetAfterResize = () => {
    const { maxX, maxY } = getBounds();
    const currentTransform = logo.style.transform;
    const matched = currentTransform.match(/translate\((\d+)px,\s*(\d+)px\)/);

    if (!matched) {
      return;
    }

    const currentX = Math.min(Number(matched[1]), maxX);
    const currentY = Math.min(Number(matched[2]), maxY);
    logo.style.transform = `translate(${currentX}px, ${currentY}px)`;
  };

  logo.addEventListener('click', () => {
    logoImage.classList.remove('spin');
    void logoImage.offsetWidth;
    logoImage.classList.add('spin');
    spinCount++;
    if (spinCountEl) spinCountEl.textContent = spinCount;
  });

  if (speedRange) {
    speedRange.addEventListener('input', () => {
      speedFactor = speedRange.value / 100;
    });
  }

  window.addEventListener('resize', resetAfterResize);
  flyToRandomSpot();
}
