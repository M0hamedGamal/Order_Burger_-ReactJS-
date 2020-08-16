/* 
npm i react-scripts@3.4.1  Or Higher --> Al1ow us to use css files in separate instead using css into JS files [Hint: Change file mame.css to mame.module.css] Check link: https://create-react-app.dev/docs/adding-a-css-modules-stylesheet.
npm i --save prop-types   --> Validation for types of props. 
npm i axios --save        --> Ajax package API to work with server [Check axios-order.js file].
npm i --save react-router react-router-dom  --> Create Routing between pages of project.

*/

import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Checkout from "./containers/Checkout/Checkout";
import Orders from "./containers/Orders/Orders";

import { Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Layout>
        <Switch>
          {/* With component You will get history, location, and match properties. */}
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
        </Switch>
      </Layout>
    );
  }
}

export default App;
