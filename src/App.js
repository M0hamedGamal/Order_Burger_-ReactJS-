/* 
npm i react-scripts@3.4.1  Or Higher --> Al1ow us to use css files in separate instead using css into JS files [Hint: Change file mame.css to mame.module.css] Check link: https://create-react-app.dev/docs/adding-a-css-modules-stylesheet.
npm i --save prop-types   --> Validation for types of props. 
*/

import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <BurgerBuilder />
        </Layout>
      </div>
    );
  }
}

export default App;
