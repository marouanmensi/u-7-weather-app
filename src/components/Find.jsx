import React, { Component } from "react";
import Weather from "./Weather";

class Find extends Component {
  render() {
    return (
      <main key={this.props.match.params.id} className="home-container">
        <Weather cityId={this.props.match.params.id} />
      </main>
    );
  }
}

export default Find;
