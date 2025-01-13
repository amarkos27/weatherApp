import 'normalize.css';
import './style.css';
import { Display } from './display';
import zipcodes from 'zipcodes';
import valZip from 'val-zip';

const APP = (() => {
  Display.init();

  const KEY = 'EFACUPEQBZ73J6DUNKPRB2PDZ';

  async function getData(query) {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${KEY}&include=hours&lang=en`
    );

    if (response.status === 200) {
      const weatherData = await response.json();
      return weatherData;
    } else {
      throw new Error('Not found');
    }
  }

  async function formatAddress(query) {
    const KEY = '4b822f3e59d44b2b843ea491fdbe3d49';
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&format=json&apiKey=${KEY}`
    );

    const data = await response.json();

    if (data.results.length) {
      const topHit = data.results[0];
      let formatted;

      if (topHit.country_code === 'us') {
        if (topHit.district) {
          formatted = `${topHit.district}, ${topHit.city}`;
        } else if (topHit.city) {
          formatted = `${topHit.city}, ${topHit.state_code}`;
        } else {
          formatted = topHit.state;
        }
      } else {
        if (topHit.city) {
          formatted = `${topHit.city}, ${topHit.country}`;
        } else if (topHit.state) {
          formatted = `${topHit.state}, ${topHit.country}`;
        } else {
          formatted = topHit.country;
        }
      }

      return formatted;
    } else {
      throw new Error('Not found');
    }
  }

  async function search(query) {
    try {
      let formattedAddress = await formatAddress(query);
      const weatherData = await getData(formattedAddress);

      Display.fillMain(formattedAddress, weatherData);
      Display.fillForecast(weatherData);
    } catch (error) {
      input.setCustomValidity(error.message);
      input.reportValidity();
      console.error(error);
    }
  }

  function loadingWrapper(func) {
    return async function (param) {
      try {
        await Display.loadingOn();
        await func(param);
      } finally {
        Display.loadingOff();
      }
    };
  }

  function convertFromZIP(query) {
    const country = 'US';
    const validUSZip = valZip(query, country);

    if (validUSZip) {
      const result = zipcodes.lookup(query);
      return `${result.city}, ${result.state}`;
    } else {
      throw new Error('If entering zip code, must be valid U.S.');
    }
  }

  function validateQuery(e) {
    const input = e.target;
    if (/^[\s]+$/.test(input.value) || input.value === '') {
      input.setCustomValidity('Cannot be an empty string');
    } else if (!/^[^\s\W]/.test(input.value)) {
      // Input must not start with a space or special character
      input.setCustomValidity('Cannot start with space or special character');
    } else if (!/[\dA-Za-z,'\s]+$/.test(input.value)) {
      input.setCustomValidity(
        'Must be in valid address format (or shortened) e.g. New York, NY, 11361'
      );
    } else {
      input.setCustomValidity('');
    }

    return input.validity.valid;
  }

  const searchWithLoading = loadingWrapper(search);

  const input = document.getElementById('search');
  input.addEventListener('input', validateQuery);
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      if (!input.validity.valid) {
        input.reportValidity();
      } else {
        const onlyDigits = /^\d+$/;
        const query = onlyDigits.test(input.value)
          ? convertFromZIP(input.value)
          : input.value;

        input.value = '';
        await searchWithLoading(query);
      }
    }
  });

  const tenDayButton = document.getElementById('ten-day');
  const backToMain = document.getElementById('return');

  tenDayButton.addEventListener('click', Display.switchPage);
  backToMain.addEventListener('click', Display.switchPage);

  async function init() {
    try {
      // Show the user their location forecast if their IP is available, else just show New York

      const KEY = '4b822f3e59d44b2b843ea491fdbe3d49';
      const response = await fetch(
        `https://api.geoapify.com/v1/ipinfo?apiKey=${KEY}`
      );
      const currentLocation = await response.json();

      if (response.ok) {
        searchWithLoading(
          `${currentLocation.city?.name}, ${
            currentLocation.state?.name || currentLocation.country?.name
          }`
        );
      }
    } catch {
      searchWithLoading('New York');
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', APP.init);
