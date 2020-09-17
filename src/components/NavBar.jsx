import React, { Component } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { getCities, getCountry } from "../services/citiesService";

class NavBar extends Component {
  state = {
    searchQuery: [],
    searchResults: [],
    cities: [],
    resultsClass: "results-container-hidden",
  };

  componentDidMount() {
    this.setState({ cities: getCities() });
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query });

    // GET CITIES
    const { cities: allCities } = this.state;

    let filtered = allCities;
    let results = [];
    let resultJoin = [];
    if (query) {
      let terms = query.split(" ");
      terms = terms.filter((term) => term !== "");
      terms.map((term, index) => {
        if (index === 0) {
          results[index] = filtered.filter(
            (m) =>
              m.name.toLowerCase().includes(term.toLowerCase()) ||
              getCountry(m.country).toLowerCase().includes(term.toLowerCase())
          );
          results[index].map((result, index) => {
            resultJoin[index] = [
              result["name"],
              getCountry(result["country"]),
              result["id"],
            ].join(", ");
          });
        } else if (index > 0) {
          resultJoin = resultJoin.filter((m) =>
            m.toLowerCase().includes(term.toLowerCase())
          );
        }
      });
    }
    let searchResults = resultJoin.map((m) => m.split(", "));
    this.setState({ searchResults });
  };

  displayResults = () => {
    this.setState({ resultsClass: "results-container" });
  };

  hideResults = () => {
    this.setState({ resultsClass: "results-container-hidden" });
  };

  render() {
    return (
      <header>
        <h1 className="logo">
          Weather
          <br />
          App
        </h1>
        <nav>
          <Link to="/" onClick={this.hideResults}>
            Home
          </Link>
          <Link to="/favourite-places" onClick={this.hideResults}>
            Favourite places
          </Link>
          <Link to="/help" onClick={this.hideResults}>
            Help
          </Link>
          <SearchBar
            value={this.state.searchQuery}
            onChange={this.handleSearch}
            results={this.state.searchResults}
            resultsClass={this.state.resultsClass}
            onClick={this.displayResults}
            onClose={this.hideResults}
          />
        </nav>
      </header>
    );
  }
}

export default NavBar;
