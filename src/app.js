import 'normalize.css';
import './style.css';
import { Display } from './display';

const APP = (() => {
  Display.init();

  const KEY = 'EFACUPEQBZ73J6DUNKPRB2PDZ';

  async function getData(query) {
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${KEY}&include=hours`
      );

      if (response.status === 200) {
        const weatherData = await response.json();
        return weatherData;
      } else {
        throw new Error('Not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async function search(query) {
    try {
      const weatherData = await getData(query);
      Display.fillMain(weatherData);
    } catch (error) {
      throw error;
    }
  }

  function loadingWrapper(func) {
    return async function (param) {
      Display.loadingOn();
      const result = await func(param);
      Display.loadingOff();

      return result;
    };
  }

  function validateQuery(e) {
    const input = e.target;
    if (/^[\s]+$/.test(input.value) || input.value === '') {
      input.setCustomValidity('Cannot be an empty string');
    } else if (!/^[^\s\W]/.test(input.value)) {
      // Input must not start with a string or special character
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

  const input = document.getElementById('search');
  input.addEventListener('input', validateQuery);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (!input.validity.valid) {
        input.reportValidity();
      } else {
        const searchWithLoading = loadingWrapper(search);
        searchWithLoading(input.value).catch((error) => {
          input.setCustomValidity(error.message);
          input.reportValidity();
        });
        input.value = '';
      }
    }
  });
})();
