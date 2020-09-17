import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import config from "../config.json";
import Forecast from "./Forecast";
import { getCountry } from "../services/citiesService";

class Weather extends Component {
  state = {
    temperature: "",
    tempMax: "",
    tempMin: "",
    city: "",
    cityId: 2673730,
    country: "",
    humidity: "",
    wind: "",
    description: "",
    sunrise: "",
    sunset: "",
    icon: "",
    celsius: true,
    fahrenheit: false,
    lat: null,
    lon: null,
    error: "",
    forecastClass: "forecast-container-hidden",
    validRequest: true,
    fetchUrl: "",
  };

  componentDidMount() {
    if (!this.props.cityId) {
      if (navigator.geolocation) {
        this.getPosition()
          .then((position) => {
            this.setState({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            this.getWeather(
              position.coords.latitude,
              position.coords.longitude
            );
          })
          .catch((err) => {
            this.setState({ errorMessage: err.message });
          });
      } else {
        this.getWeather(false, false);
      }
      this.loadDefault();
    } else {
      this.getWeather(false, false);
    }
  }

  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  loadDefault = () => {
    if (!this.state.lat && !this.state.lon) {
      this.getWeather(false, false);
    }
  };

  getWeather = async (lat, lon) => {
    try {
      let fetchUrl = "";
      if (lat && lon) {
        fetchUrl = `//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.API_KEY}`;
        console.log("fetchUrl.using.latlon:", fetchUrl);
      } else if (!this.props.cityId) {
        fetchUrl = `http://api.openweathermap.org/data/2.5/weather?id=${this.state.cityId}&appid=${config.API_KEY}`;
        console.log("fetchUrl.using.stockholm:", fetchUrl);
      } else {
        fetchUrl = `http://api.openweathermap.org/data/2.5/weather?id=${this.props.cityId}&appid=${config.API_KEY}`;
        this.setState({ cityId: this.props.cityId });
        console.log("fetchUrl.using.props:", fetchUrl);
      }
      const api = await fetch(fetchUrl);
      const data = await api.json();

      // const data = require(`../assets/stockholm.json`);
      if (data) {
        this.setState({
          lat: lat,
          lon: lon,
          city: data.name,
          country: getCountry(data.sys.country),
          temperature: Math.round(data.main.temp - 273.15),
          tempMax: Math.round(data.main.temp_max - 273.15),
          tempMin: Math.round(data.main.temp_min - 273.15),
          humidity: data.main.humidity,
          wind: data.wind.speed,
          description: data.weather[0].description,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          icon: data.weather[0].icon,
          error: "",
          fetchUrl: fetchUrl,
        });
      }
    } catch (e) {
      this.setState({ validRequest: false });
      console.log("ERROR IN API REQUEST:", e);
    }
  };

  displayF = () => {
    this.setState({
      celsius: false,
      fahrenheit: true,
      temperature: Math.round((this.state.temperature * 9) / 5 + 32),
      tempMin: Math.round((this.state.tempMin * 9) / 5 + 32),
      tempMax: Math.round((this.state.tempMax * 9) / 5 + 32),
    });
  };

  displayC = () => {
    this.setState({
      celsius: true,
      fahrenheit: false,
      temperature: Math.round((this.state.temperature - 32) * (5 / 9)),
      tempMin: Math.round((this.state.tempMin - 32) * (5 / 9)),
      tempMax: Math.round((this.state.tempMax - 32) * (5 / 9)),
    });
  };

  handleReturn = () => {
    this.setState({ forecastClass: "forecast-container-hidden" });
  };

  handleClick = () => {
    this.setState({ forecastClass: "forecast-container" });
  };

  render() {
    const {
      sunrise,
      sunset,
      description,
      wind,
      humidity,
      temperature,
      tempMin,
      tempMax,
      country,
      city,
      icon,
      celsius,
      fahrenheit,
      error,
      forecastClass,
    } = this.state;
    const sunsriseClock = new Date(sunrise * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const sunsetClock = new Date(sunset * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const weatherCode = icon.slice(0, 2).toString();
    let cityId = "";
    if (this.props.cityId) {
      cityId = this.props.cityId;
    } else {
      cityId = this.state.cityId;
    }
    if (!this.state.validRequest) {
      return <Redirect to="/not-found" />;
    } else {
      return (
        <React.Fragment>
          <div className="weather-container" key={cityId}>
            <h2>
              {city}
              <span> {country}</span>
            </h2>
            <div className="weather-overview">
              <span>
                {temperature}
                <button onClick={this.displayC} disabled={celsius}>
                  °C
                </button>
                <button onClick={this.displayF} disabled={fahrenheit}>
                  °F
                </button>
              </span>
              <img
                src={process.env.PUBLIC_URL + "/img/" + weatherCode + ".png"}
                placeholder="img"
                alt="img"
              />
            </div>
            <div id="weather-description">{description}</div>
            <ul>
              <li>
                <span className="daily-temp">
                  {tempMin}
                  {celsius && "°C"}
                  {celsius || "°F"}
                </span>
                Min
              </li>
              <li>
                <span className="daily-temp">
                  {tempMax}
                  {celsius && "°C"}
                  {celsius || "°F"}
                </span>
                Max
              </li>
              <li>
                <span>{humidity}%</span>Humidity
              </li>
              <li>
                <span>{wind} mph</span>Wind
              </li>
              <li>
                <span>{sunsriseClock}</span>Sunrise
              </li>
              <li>
                <span>{sunsetClock.slice(0)}</span>Sunset
              </li>
            </ul>
            {error && <p>error :{error}</p>}
            <div className="weather-extra" onClick={this.handleClick}>
              <div>5-day forecast</div>
            </div>
          </div>
          <Forecast
            forecastClass={forecastClass}
            cityId={cityId}
            onClick={this.handleReturn}
            celsius={celsius}
          />
        </React.Fragment>
      );
    }
  }
}

export default Weather;
