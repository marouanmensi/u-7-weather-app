import { countries } from "country-data";

const cities = require("../assets/city.list.json");

export function getCities() {
  return cities;
}

export function getCountry(country) {
  return countries[country].name;
}

// Example

//{
//    "id": 2643743,
//    "name": "London",
//    "state": "",
//    "country": "GB",
//    "coord": {
//      "lon": -0.12574,
//      "lat": 51.50853
//    }
