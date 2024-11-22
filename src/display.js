import Icon from './images/chevron-down-svgrepo-com.svg';

const Display = (() => {
  const main = document.querySelector('.main');

  // 10 day forecast page
  const forecast = document.querySelector('.forecast');

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
  };
})();

export { Display };
