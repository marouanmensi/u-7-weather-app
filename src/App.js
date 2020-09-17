import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Find from "./components/Find";
import NotFound from "./components/NotFound";
import "./App.css";
import FavouritePlaces from "./components/FavouritePlaces";
import Help from "./components/Help";
import HourlyWeather from "./components/HourlyWeather";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Route path="/find/:id" component={Find} />
          <Route path="/details/:celsius/:id" component={HourlyWeather} />
          <Route path="/favourite-places" component={FavouritePlaces} />
          <Route path="/help" component={Help} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/" exact component={Home} />
          <Redirect to="/not-found" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
