import React, { Component } from "react";
import { Link } from "react-router-dom";

class SearchResults extends Component {
  renderResults(results, resultsClass) {
    if (!results) console.log("results variable is undefined");
    else if (results.length === 0)
      return (
        <div className={resultsClass}>
          <div className="close-btn" onClick={this.props.onClose}>
            <img
              src={process.env.PUBLIC_URL + "/img/close-btn.png"}
              placeholder="close"
              alt="close"
            />
          </div>
          <p>Type a city or a country</p>
        </div>
      );
    else
      return (
        <div className={resultsClass}>
          <div className="close-btn" onClick={this.props.onClose}>
            <img
              src={process.env.PUBLIC_URL + "/img/close-btn.png"}
              placeholder="close"
              alt="close"
            />
          </div>
          <ul className="results-list">
            {results.slice(0, 10).map((result, index) => (
              <Link
                key={index}
                to={`/find/${result[2]}`}
                onClick={this.props.onClose}
              >
                {result[0]}, {result[1]}
              </Link>
            ))}
          </ul>
        </div>
      );
  }
  render() {
    const { searchResults, resultsClass } = this.props;
    return (
      <React.Fragment>
        {this.renderResults(searchResults, resultsClass)}
      </React.Fragment>
    );
  }
}

export default SearchResults;
