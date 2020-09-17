import React from "react";
import "../WeatherDayCard.css";
var moment = require("moment");

const WeatherDayCard = ({
  reading,
  celsius,
  minTemp,
  maxTemp,
  description,
  icon,
}) => {
  let newDate = new Date();
  const weekday = reading.dt * 1000;
  newDate.setTime(weekday);
  let minTemperature = null;
  let maxTemperature = null;
  let unit = "";
  if (!celsius) {
    minTemperature = Math.round((minTemp * 9) / 5 + 32);
    maxTemperature = Math.round((maxTemp * 9) / 5 + 32);
    unit = " °F";
  } else {
    minTemperature = Math.round(minTemp);
    maxTemperature = Math.round(maxTemp);
    unit = " °C";
  }

  return (
    <div className={maxTemp > 10 ? "card" : "card cold"}>
      <h3>{moment(newDate).format("dddd")}</h3>
      <p>{moment(newDate).format("MMMM Do")}</p>
      <img
        src={process.env.PUBLIC_URL + "/img/" + icon + ".png"}
        placeholder="img"
        alt="img"
      />
      <h2>
        {minTemperature} / {maxTemperature}
        {unit}
      </h2>
      <div>
        <p id="forecast-description">{description}</p>
      </div>
    </div>
  );
};

export default WeatherDayCard;
