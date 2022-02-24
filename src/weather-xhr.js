import React from 'react';

const apiKey = process.env.REACT_APP_API_KEY;

//------------components------------------
const LowTemp = (props) => {
  return (
    <React.Fragment>
      <img className="temperature-icon" src="/weather-icons/31-s.png" alt="thermometer with a low temperature" />
      <label>low:</label>
      &nbsp;{props.temp}&#176;<sup>C</sup>
    </React.Fragment>
  );
};

const HighTemp = (props) => {
  return (
    <React.Fragment>
      <label>high:</label>
      &nbsp;{props.temp}&#176;<sup>C</sup>
      <img className="temperature-icon" src="/weather-icons/30-s.png" alt="thermometer with a high temperature" />
    </React.Fragment>
  );
};

const CityCard = (props) => {
  //props object must include all of these:
  //location, iconCode, iconAlt, description, lowTemp, highTemp, time
  let weather = props.weather; //local scope for easy access

  function LocationDisplay(props) {
    return (
      <div className="location-display">{weather.location}</div>
    );
  }

  function SkyDisplay(props) {
    //filename format looks like 08-s.png
    let imageName = weather.iconCode + "-s.png";
    if(imageName.length < 8) {
      imageName = "0" + imageName;
    }

    return (
      <div className="sky-display">
        <img className="weather-icon" src={"/weather-icons/" + imageName} alt={weather.Alt} />&nbsp;
        <p className="weather-description">{weather.description}</p>
      </div>
    );
  }

  function TempDisplay(props) {
    return (
      <div className="temp-display">
        <LowTemp temp={weather.lowTemp} />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <HighTemp temp={weather.highTemp} />
      </div>
    );
  }

  function TimeDisplay(props) {
    //TODO: make this a link that can fetch weather by city key again
    return (
      <div className="time-display">Last checked: {weather.time}</div>
    );
  }

  return (
    <section>
      <LocationDisplay />
      <SkyDisplay />
      <TempDisplay />
      <TimeDisplay />
    </section>
  );
};

//------------utility functions----------

function displayCityList(cityList, setter) {
  function getWeather(cityKey, location) {
    //TODO: if time, write a sanity check to make sure this looks like a key
    weatherXHR("weather", cityKey, location, setter);
    return 0;
  }

  //TODO: if time, array.map to display all listed cities for user to choose
  try {
    let topRankedKey = cityList[0].Key;
    let locationName = cityList[0]["LocalizedName"] + ", " +
      cityList[0]["Country"]["LocalizedName"];
    setter(<section>Getting weather info for {locationName}...</section>);
    getWeather(topRankedKey, locationName);
  }
  catch(err) {
    console.error("cityList in displayCityList had unexpected format");
    setter(<section>Sorry, there was a problem identifying the city.</section>);
  }

  return 0;
}

function displayCityCard(weatherData, setter) {
  const today = weatherData.DailyForecasts[0];
  let date = new Date();

  let weather = {
    location : weatherData.location,
    iconCode : today.Day.Icon,
    iconAlt : today.Day.IconPhrase,
    description : today.Day.IconPhrase,
    lowTemp : today.Temperature.Minimum.Value,
    highTemp : today.Temperature.Maximum.Value,
    time : date.toLocaleTimeString()
  };

  let populatedCard = <CityCard weather={weather} />
  setter(populatedCard);
  return 0;
}

function weatherXHR(cityOrWeather, value, location, callback) {
  // remember during testing that there's a max of 50 api calls per day

  let path = "https://dataservice.accuweather.com/";
  let miscParams = "&language=en-US";

  let defaultError = <section>Sorry, there was a problem fetching the weather info.</section>;
  if(cityOrWeather === "city") {
    //uri to get array of possible location keys by city name
    path = path + `locations/v1/cities/search?apikey=${apiKey}&q=${value}` + miscParams;
  }
  else if(cityOrWeather === "weather") {
    //uri to get weather data by location key
    path = path + `forecasts/v1/daily/1day/${value}?apikey=${apiKey}&metric=true` + miscParams;
  }
  else {
    console.error("unrecognized option in xhr");
    callback(defaultError);
    return 0;
  }

  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    let response;

    if(this.readyState === 4 && this.status === 200) {
      if(cityOrWeather === "city") {
        //the Search by City api response is a list of matching cities to choose from
        response = JSON.parse(this.responseText);
        displayCityList(response, callback);
      }
      else {
        //the Weather by Key api response contains the actual weather data
        //pass setter to function that will parse weather data for display
        response = JSON.parse(this.responseText);
        response.location = location;
        displayCityCard(response, callback);
      }
    }
    else {
      callback(defaultError);
    }
  };
  xhr.onerror = function(err) {
    console.error(err);
    callback(<section>Couldn't reach the weather server. Please try again later.</section>);
  }
  xhr.open("GET", path, true);
  xhr.send();

  return 0;
}

export { weatherXHR };
