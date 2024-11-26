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
    conditions: document.querySelector('.conditions'),
    high: document.querySelector('.high'),
    low: document.querySelector('.low'),
    humidity: document.querySelector('.humidity'),
  };

  // Icons for hourly condition panes
  let conditionIcons;

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

  function getImages(request) {
    return new Promise((resolve) => {
      try {
        let images = {};
        request.keys().forEach((key) => {
          images[key.replace('./', '')] = request(key);
        });

        resolve(images);
      } catch (error) {
        console.error(error.message);
      }
    });
  }

  async function loadingOn() {
    return new Promise((resolve) => {
      header.container.classList.add('hidden');
      hourlyConditions.container.classList.add('hidden');

      header.container.addEventListener(
        'transitionend',
        () => {
          loading.classList.remove('hidden');

          loading.addEventListener('transitionend', () => resolve(), {
            once: true,
          });
        },
        { once: true }
      );
    });
  }

  function loadingOff() {
    loading.classList.add('hidden');

    loading.addEventListener(
      'transitionend',
      () => {
        header.container.classList.remove('hidden');
        hourlyConditions.container.classList.remove('hidden');
      },
      { once: true }
    );
  }

  function fillHeader(now, today, location) {
    // Omit 'United States' from the location string if present
    const omitUS = /.*?(?=, United States|$)/.exec(location)[0];

    header.location.textContent = omitUS;
    header.temp.innerHTML = `${Math.floor(
      today.hours[now].temp
    )} <span>°</span>`;
    header.conditions.textContent = `${today.conditions}`;
    header.high.textContent = `H: ${Math.floor(today.tempmax)}°`;
    header.low.textContent = `L: ${Math.floor(today.tempmin)}°`;
    header.humidity.textContent = `Humidity: ${Math.floor(today.humidity)}%`;
  }

  function twelveHourFormat(hour) {
    const time = Number(hour.datetime.substring(0, 2));
    let converted;

    if (time < 12) {
      converted = `${time} AM`;
    } else if (time > 12) {
      converted = `${time - 12} PM`;
    } else {
      converted = '12 PM';
    }

    return converted;
  }

  function fillHourly(now, hourForecasts) {
    // Only show 6 hours at a time
    const relevantHours = hourForecasts.slice(now, now + 6);

    hourlyConditions.hours.forEach((pane, index) => {
      pane.innerHTML = '';
      const hour = relevantHours[index];
      let timeString;
      let time, icon, temp;

      if (index === 0) {
        timeString = 'Now';
      } else {
        timeString = twelveHourFormat(hour);
      }

      time = document.createElement('span');
      time.classList.add('time');
      time.textContent = timeString;

      icon = document.createElement('img');
      icon.classList.add('hourIcon');
      icon.src = conditionIcons[`${hour.icon}.svg`];
      icon.alt = hour.icon;

      temp = document.createElement('span');
      temp.classList.add('hourTemp');
      temp.textContent = `${Math.floor(hour.temp)}°`;

      pane.append(time, icon, temp);
    });
    console.log(hourForecasts);
  }

  function fillMain(data) {
    const now = new Date().getHours();
    const today = data.days[0];
    const location = data.resolvedAddress;

    fillHeader(now, today, location);
    fillHourly(now, today.hours);
  }

  function listeners() {
    tenDayButton.button.addEventListener('mouseenter', () => {
      tenDayButton.button.appendChild(tenDayButton.chevron);

      tenDayButton.button.addEventListener(
        'mouseleave',
        () => {
          tenDayButton.chevron.remove();
        },
        { once: true }
      );
    });
  }

  function init() {
    listeners();

    // Import all icon images and cache them when the promise if fulfilled
    getImages(require.context('./SVG/icons', false, /\.svg$/i)).then(
      (response) => {
        conditionIcons = response;
      }
    );
  }

  return {
    init,
    loadingOn,
    loadingOff,
    fillMain,
  };
})();

export { Display };
