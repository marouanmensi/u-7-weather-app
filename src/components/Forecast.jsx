import React, { Component } from "react";
import config from "../config.json";
import WeatherDayCard from "./WeatherDayCard";
import { Link, Redirect } from "react-router-dom";

class Forecast extends Component {
  state = {
    fullData: [],
    dailyData: [],
    minTemps: [],
    maxTemps: [],
    descriptions: [],
    icons: [],
    validRequest: true,
  };

  componentDidMount = () => {
    this.getForecast();
  };

  dailyValues = (dailyData) => {
    try {
      let index = dailyData.findIndex(function (item, i) {
        return item.dt_txt.endsWith("00:00:00");
      });
      let nextDaysArray = [
        dailyData.slice(index, index + 8),
        dailyData.slice(index + 8, index + 16),
        dailyData.slice(index + 16, index + 24),
        dailyData.slice(index + 24, index + 32),
        dailyData.slice(index + 32),
      ];
      let dailyTemps = [];
      let dailyIcons = [];
      nextDaysArray.forEach((element, index) => {
        let dailyTemp = [];
        let dailyIcon = [];
        element.forEach((element, index) => {
          dailyTemp[index] = element["main"]["temp"];
          dailyIcon[index] = element["weather"][0]["icon"].slice(0, 2);
        });
        dailyTemps[index] = dailyTemp;
        dailyIcons[index] = dailyIcon;
      });

      let maxTemps = [];
      let minTemps = [];
      dailyTemps.forEach((element, index) => {
        maxTemps[index] = Math.round(Math.max(...element) - 273.15);
        minTemps[index] = Math.round(Math.min(...element) - 273.15);
      });
      let icons = [];
      dailyIcons.forEach((element, index) => {
        icons[index] = mode(element);
      });
      let descIndex = [];
      nextDaysArray.forEach((day, i) => {
        let j = day.findIndex(function (item) {
          return item["weather"][0]["icon"].includes(icons[i].toString());
        });
        descIndex.push(j);
      });
      let descriptions = [];
      nextDaysArray.forEach((day, index) => {
        descriptions[index] =
          day[descIndex[index]]["weather"][0]["description"];
      });

      function mode(arr) {
        let numMapping = {};
        let greatestFreq = 0;
        let mode;
        arr.forEach(function findMode(number) {
          numMapping[number] = (numMapping[number] || 0) + 1;

          if (greatestFreq < numMapping[number]) {
            greatestFreq = numMapping[number];
            mode = number;
          }
        });
        return +mode;
      }
      return { maxTemps, minTemps, descriptions, icons };
    } catch (e) {
      this.setState({ validRequest: false });
      console.log("Error in dailyValues function", e);
    }
  };

  getForecast = () => {
    if (this.props.cityId) {
      try {
        const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?id=${this.props.cityId}&appid=${config.API_KEY}`;

        fetch(weatherURL)
          .then((res) => res.json())
          .then((data) => {
            // const data = require(`../assets/forecast.json`);
            if (Object.keys(data).length > 2) {
              const {
                maxTemps,
                minTemps,
                descriptions,
                icons,
              } = this.dailyValues(data.list);

              // const dailyData = data["list"];

              const dailyData = data.list.filter((reading) =>
                reading.dt_txt.includes("00:00:00")
              );

              const fullData = data["list"];

              this.setState({
                fullData,
                dailyData,
                minTemps,
                maxTemps,
                descriptions,
                icons,
              });
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

  weatherDaysCardsRender = (
    celsius,
    minTemps,
    maxTemps,
    descriptions,
    icons
  ) => {
    return this.state.dailyData.map((reading, index) => (
      <WeatherDayCard
        reading={reading}
        key={index}
        city={this.state.city}
        celsius={celsius}
        minTemp={minTemps[index]}
        maxTemp={maxTemps[index]}
        description={descriptions[index]}
        icon={icons[index]}
      />
    ));
  };

  render() {
    const { minTemps, maxTemps, descriptions, icons } = this.state;
    if (!this.state.validRequest) {
      return <Redirect to="/not-found" />;
    } else {
      return (
        <div className={this.props.forecastClass}>
          <div id="go-back-arrow" onClick={this.props.onClick}>
            <img
              src={process.env.PUBLIC_URL + "/img/back-arrow.png"}
              placeholder="img"
              alt="img"
            />
          </div>
          <div key={this.state.temperature} className="cards-container">
            {this.weatherDaysCardsRender(
              this.props.celsius,
              minTemps,
              maxTemps,
              descriptions,
              icons
            )}
          </div>
          <div className="intervals-button">
            <Link
              to={`/details/${this.props.celsius}/${this.props.cityId}`}
              onClick={this.props.onClose}
            >
              3-hour intervals
            </Link>
          </div>
        </div>
      );
    }
  }
}

export default Forecast;
