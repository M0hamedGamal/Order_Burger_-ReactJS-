/* 
npm i react-scripts@3.4.1  Or Higher --> Al1ow us to use css files in separate instead using css into JS files [Hint: Change file mame.css to mame.module.css] Check link: https://create-react-app.dev/docs/adding-a-css-modules-stylesheet.
npm i --save prop-types   --> Validation for types of props. 
npm i --save axios        --> Ajax package API to work with server [Check axios-order.js file].
npm i --save react-router react-router-dom  --> Create Routing between pages of project.
npm i --save redux --> install redux lib.
npm i --save react-redux --> connect redux to react.
npm i --save redux-thunk --> add middleware between action & reducer to redux.
*/

import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Checkout from "./containers/Checkout/Checkout";
import Orders from "./containers/Orders/Orders";
import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout/Logout";
import * as actions from "./store/actions/index";
import { connect } from "react-redux";

import { Route, Switch } from "react-router-dom";

class App extends Component {
  componentDidMount() {
    this.props.onTruAutoSignup();
  }
  render() {
    return (
      <Layout>
        <Switch>
          {/* With component You will get history, location, and match properties. */}
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/auth" component={Auth} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </Layout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTruAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(null, mapDispatchToProps)(App);
