const logo = document.querySelector('.floating-logo');
const logoImage = document.querySelector('.floating-logo img');

if (logo && logoImage) {
  const MIN_TRAVEL_MS = 700;
  const MAX_TRAVEL_MS = 1800;

  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

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
    const duration = randomInt(MIN_TRAVEL_MS, MAX_TRAVEL_MS);

    logo.style.transitionDuration = `${duration}ms`;
    logo.style.transform = `translate(${nextX}px, ${nextY}px)`;

    window.setTimeout(flyToRandomSpot, duration);
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
  });

  window.addEventListener('resize', resetAfterResize);
  flyToRandomSpot();
}
