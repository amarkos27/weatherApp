import Icon from './images/chevron-down-svgrepo-com.svg';
import moment from 'moment-timezone';
import { format } from 'date-fns';

const Display = (() => {
  const content = document.querySelector('.content');

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

  const tenDays = document.querySelectorAll('.day');

  function getImages(request) {
    let images = {};
    request.keys().forEach((key) => {
      images[key.replace('./', '')] = request(key);
    });

    return images;
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

  function twelveHourFormat(hour) {
    const time = Number(hour.datetime.substring(0, 2));
    let converted;

    if (time === 0) {
      converted = '12 AM';
    } else if (time < 12) {
      converted = `${time} AM`;
    } else if (time > 12) {
      converted = `${time - 12} PM`;
    } else {
      converted = '12 PM';
    }

    return converted;
  }

  function fillHeader(now, today, location) {
    // Omit 'United States' from the location string if present
    const omitUS = /.*?(?=, United States|$)/.exec(location)[0];

    header.location.textContent = omitUS;
    header.temp.innerHTML = `${Math.floor(today.hours[now].temp)}°`;
    header.conditions.textContent = `${today.hours[now].conditions}`;
    header.high.textContent = `H: ${Math.floor(today.tempmax)}°`;
    header.low.textContent = `L: ${Math.floor(today.tempmin)}°`;
    header.humidity.textContent = `Humidity: ${Math.floor(
      today.hours[now].humidity
    )}%`;
  }

  function fillHourly(now, data) {
    // Only show 6 hours at a time
    let i = 0;
    const relevantHours = data.days[0].hours.slice(now, now + 6);

    // Pull hours from tomorrow's forecast if reaching the end of today's hours
    while (relevantHours.length < 6) {
      relevantHours.push(data.days[1].hours[i]);
      i++;
    }

    hourlyConditions.hours.forEach((pane, index) => {
      pane.innerHTML = '';

      const hour = relevantHours[index];
      let timeString;
      let icon, temp;
      let time = document.createElement('span');

      if (index === 0) {
        timeString = 'Now';
        time.classList.add('bold');
      } else {
        timeString = twelveHourFormat(hour);
      }

      time.classList.add('time');
      time.textContent = timeString;

      icon = document.createElement('img');
      icon.classList.add('icon');
      icon.src = conditionIcons[`${hour.icon}.svg`];
      icon.alt = hour.icon;

      temp = document.createElement('span');
      temp.classList.add('hourTemp');
      temp.textContent = `${Math.floor(hour.temp)}°`;

      pane.append(time, icon, temp);
    });
  }

  function fillMain(formattedAddress, data) {
    const now = moment.tz(new Date(), data.timezone).hour();
    const today = data.days[0];
    const location = formattedAddress;

    fillHeader(now, today, location);
    fillHourly(now, data);
  }

  function fillForecast(weatherData) {
    tenDays.forEach((dayPane, index) => {
      dayPane.innerHTML = '';

      const dayForecast = weatherData.days[index];
      fillDay(dayPane, dayForecast, index);
    });
  }

  function fillDay(dayPane, dayForecast, index) {
    // console.log(dayForecast);
    let dateString;
    const date = document.createElement('span');
    date.classList.add('forecast-humidity');

    if (index === 0) {
      dateString = 'Today';
      date.classList.add('bold');
    } else {
      const dateComponents = dayForecast.datetime.split('-');
      const year = dateComponents[0];
      const month = Number(dateComponents[1]) - 1;
      const day = dateComponents[2];

      dateString = format(new Date(year, month, day), 'M/dd');
    }
    date.textContent = dateString;

    const iconWrapper = document.createElement('div');
    const icon = document.createElement('img');
    icon.classList.add('icon');
    icon.src = conditionIcons[`${dayForecast.icon}.svg`];
    icon.alt = dayForecast.icon;
    iconWrapper.append(icon);

    const high = document.createElement('span');
    high.classList.add('forecast-high');
    high.textContent = `High: ${Math.floor(dayForecast.tempmax)}°`;

    const low = document.createElement('span');
    low.classList.add('forecast-low');
    low.textContent = `Low: ${Math.floor(dayForecast.tempmin)}°`;

    const humidity = document.createElement('span');
    humidity.classList.add('forecast-humidity');
    humidity.textContent = `Humidity: ${Math.floor(dayForecast.humidity)}%`;

    dayPane.append(date, iconWrapper, high, low, humidity);
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

  function switchPage() {
    content.classList.add('swap-transition');
    content.classList.toggle('pageTwo');

    content.addEventListener(
      'transitionend',
      () => {
        content.classList.remove('swap-transition');

        if (content.classList.contains('pageTwo')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      { once: true }
    );
  }

  function init() {
    listeners();

    // Import all icon images and cache them
    conditionIcons = getImages(
      require.context('./SVG/icons', false, /\.svg$/i)
    );
  }

  return {
    init,
    loadingOn,
    loadingOff,
    fillMain,
    fillForecast,
    switchPage,
  };
})();

export { Display };
