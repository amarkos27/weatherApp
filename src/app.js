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
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${KEY}&include=hours`
    );

    if (response.status === 200) {
      const weatherData = await response.json();
      return weatherData;
    } else {
      throw new Error('Not found');
    }
  }

  async function search(query) {
    const weatherData = await getData(query);
    Display.fillMain(weatherData);
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
    try {
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
    } catch (error) {
      input.setCustomValidity(error.message);
      input.reportValidity();
      console.error(error);
    }
  });

  async function init() {
    searchWithLoading('New York');
  }

  return { init };
})();

APP.init();
