import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../hourlyWeather.css";
import moment from "moment";
import config from "../config.json";
import { getCountry } from "../services/citiesService";
import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

class HourlyWeather extends Component {
  state = {
    fullData: [],
    city: "",
    country: "",
    celsius: true,
    fahrenheit: false,
    temps: [],
    weatherChartsData: {},
    validRequest: true,
  };

  componentDidMount() {
    if (
      this.props.match.params.celsius === "false" ||
      this.props.match.params.celsius === false
    ) {
      this.setState({ celsius: false, fahrenheit: true });
      this.getForecast(false);
    } else {
      this.getForecast(true);
    }
  }
  getForecast = (celsius) => {
    if (this.props.match.params.id) {
      try {
        const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?id=${this.props.match.params.id}&appid=${config.API_KEY}`;
        fetch(weatherURL)
          .then((res) => res.json())
          .then((data) => {
            // const data = require(`../assets/forecast.json`);
            if (Object.keys(data).length > 2) {
              const fullData = data["list"];
              const city = data["city"]["name"];
              const country = getCountry(data["city"]["country"]);
              this.setState({
                fullData,
                city,
                country,
              });
              this.getTemps(fullData, celsius);
            } else {
              this.setState({ validRequest: false });
            }
          });
      } catch (e) {
        this.setState({ validRequest: false });
        console.log("Error in API request of Forecast component.", e);
      }
    }
  };

  weather3Hours = () => {
    const interval = this.state.fullData.map((full, index) => {
      let newDate = new Date();
      const weekday = full.dt * 1000;
      newDate.setTime(weekday);
      const icon = full.weather[0].icon.slice(0, 2).toString();
      const imgURL = process.env.PUBLIC_URL + "/img/" + icon + ".png";
      return this.fullWeatherDetailRender(
        newDate,
        full,
        imgURL,
        this.state.celsius,
        index
      );
    });
    return interval;
  };

  fullWeatherDetailRender = (newDate, full, imgURL, celsius, index) => {
    return (
      <div key={index} className="container">
        <div className="info">
          <div className="data-time">
            <h3 className="info-day">{moment(newDate).format("dddd")}</h3>
            <p className="text-muted">{moment(newDate).format("MMMM Do")}</p>
            <p className="hour">{moment(newDate).format("LT")}</p>
          </div>
          <p className="conditions">{full.weather[0].description}</p>
          <img className="weatherIcon" src={imgURL} alt="weather icon"></img>
          <p className="temp">
            <span>
              {celsius && Math.round(full.main.temp - 272.15)}
              {celsius && "°C"}
              {celsius || Math.round((full.main.temp * 9) / 5 - 459.67)}
              {celsius || "°F"}
            </span>
          </p>
          <p className="Humidity">Humidity: {full.main.humidity} %</p>
          <p className="windSpeed">Wind: {full.wind.speed} kmh </p>
        </div>
      </div>
    );
  };

  displayF = () => {
    this.setState({
      celsius: false,
      fahrenheit: true,
    });
    this.getForecast(false);
  };

  displayC = () => {
    this.setState({
      celsius: true,
      fahrenheit: false,
    });
    this.getForecast(true);
  };

  getTemps = (fullData, celsius) => {
    let temps = [];
    fullData.forEach((full, index) => {
      temps[index] = {
        temperature:
          celsius === "true" || celsius === true
            ? Math.round(full.main.temp - 272.15)
            : Math.round((full.main.temp * 9) / 5 - 459.67),
        name: moment(full.dt_txt).format("dddd"),
      };
    });
    this.setState({ temps });
  };

  render() {
    const weatherChartsData = this.state.temps;
    const { celsius, fahrenheit, city, country } = this.state;

    if (!this.state.validRequest) {
      return <Redirect to="/not-found" />;
    } else {
      return (
        <main className="home-container">
          <div className="details-container">
            <h2>
              {city}
              <span>{country}</span>
            </h2>
            <div>
              <button onClick={this.displayC} disabled={celsius}>
                °C
              </button>
              <button onClick={this.displayF} disabled={fahrenheit}>
                °F
              </button>
            </div>
            <AreaChart
              width={900}
              height={300}
              data={weatherChartsData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="name"
                stroke={"white"}
                interval={8}
                padding={{ left: 2, right: 2 }}
              />
              <YAxis
                stroke={"white"}
                domain={["dataMin - 1", "dataMax + 3"]}
                padding={{ top: 1, bottom: 1 }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#44337a"
                fill="#44337a"
              />
            </AreaChart>

            <div className="weather-hours">{this.weather3Hours()}</div>
          </div>
        </main>
      );
    }
  }
}

export default HourlyWeather;
