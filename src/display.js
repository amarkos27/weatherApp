import Icon from './images/chevron-down-svgrepo-com.svg';

const Display = (() => {
  const main = document.querySelector('.main');

  // 10 day forecast page
  const forecast = document.querySelector('.forecast');

  // Loading icon
  const loading = document.querySelector('.loading');

  // Header of main page that displays current conditions
  const header = {
    container: document.querySelector('.header'),
    location: document.querySelector('.location'),
    temp: document.querySelector('.temp'),
    high: document.querySelector('.high'),
    low: document.querySelector('.low'),
    humidity: document.querySelector('.humidity'),
  };

  // Container with six hour panes to show conditions
  const hourlyConditions = {
    container: document.querySelector('.hourly-conditions'),
    hours: document.querySelectorAll('.hour'),
  };

  // Button that switches to 10 day forecast page
  const chevron = document.createElement('img');
  chevron.src = Icon;
  chevron.alt = 'Arrow';
  chevron.classList = 'chevron slideIn';

  const tenDayButton = {
    button: document.getElementById('ten-day'),
    chevron,
  };

  function loadingOn() {
    loading.classList.remove('hidden', 'out-of-flow');
    header.container.classList.add('hidden', 'out-of-flow');
  }

  function loadingOff() {
    header.container.classList.remove('hidden', 'out-of-flow');
    loading.classList.add('hidden', 'out-of-flow');
  }

  function fillHeader(today, location) {
    // Omit 'United States' from the location string if present
    const omitUS = /.*?(?=, United States|$)/.exec(location)[0];

    header.location.textContent = omitUS;
    header.temp.textContent = `${Math.floor(today.temp)}°`;
    header.high.textContent = `H: ${Math.floor(today.tempmax)}°`;
    header.low.textContent = `L: ${Math.floor(today.tempmin)}°`;
    header.humidity.textContent = `Humidity: ${Math.floor(today.humidity)}%`;
  }

  function fillMain(data) {
    const today = data.days[0];
    const location = data.resolvedAddress;
    fillHeader(today, location);
  }

  function listeners() {
    tenDayButton.button.addEventListener('mouseenter', () => {
      tenDayButton.button.appendChild(tenDayButton.chevron);

      tenDayButton.button.addEventListener('mouseleave', () => {
        tenDayButton.chevron.remove();
      });
    });
  }

  function init() {
    listeners();
  }

  return {
    init,
    loadingOn,
    loadingOff,
    fillMain,
  };
})();

export { Display };
