//------------React imports---------------
import './App.css';
import React from 'react';

//------------my imports-----------------

import { CityWeather } from './CityWeather.js';
import { weatherXHR } from './weather-xhr.js';

//------------components------------------

const FooterCredit = (props) => {
  //terms of use says to credit them by showing accuweater logo, linked to their site
  return (
    <footer>
      designed by inthse<br />
      API powered by&nbsp;
      <a href="http://www.accuweather.com/" target="_blank" rel="noreferrer">
        <img className="logo" src="/accuweather.png" alt="AccuWeather logo" />
      </a>
    </footer>
  );
};

//------------main app-------------------

function App() {

  return (
    <div className="App">
      <header>
        Simple Weather
      </header>
      <CityWeather fetcher={weatherXHR} />
      <FooterCredit />
    </div>
  );
}

export default App;
