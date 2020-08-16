import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";
import { Route } from "react-router-dom";

class Checkout extends Component {
  state = {
    ingredients: {},
    totalPrice: 0,
  };

  componentDidMount() {
    /*
        Take a look on it.
        console.log(this.props.history);
        console.log(this.props.match);
        console.log(this.props.location); 
    */

    /*  Get addition props from Route into App.js.
        Now you can see props/location/search --> you can get data that sent into query params with path that response on render this Component.
        console.log(this.props.location.search);
    */
    // URLSearchParams built-in Object to get data from search query params.
    const query = new URLSearchParams(this.props.location.search);

    const ingredients = {};
    let price = 0;

    // for..of --> Loop onto elements of Array.
    for (let param of query.entries()) {
      // Sent price into query params with ingredients. So we wanna store it into price variable.
      if (param[0] === "price") {
        price = param[1];
      } else {
        // ['salad', '1']  |   +param[1] --> convert string to number.
        // console.log(param);
        ingredients[param[0]] = +param[1];
      }
    }

    this.setState({
      ingredients: ingredients,
      totalPrice: price,
    });
  }
  checkoutCanceledHandler = () => {
    // console.log(this.props);
    // goBack is a function into history props get from Route Component [Check App.js].
    // goBack to the previous page into the stack of pages.
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.push(this.props.match.path + "/contact-data");
  };

  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.state.ingredients}
          checkoutCanceled={this.checkoutCanceledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
        <Route
          path={this.props.match.path + "/contact-data"}
          render={() => (
            <ContactData
              ingredients={this.state.ingredients}
              totalPrice={this.state.totalPrice}
              // With render You will miss history, location, and match properties. So you need to send props of Checkout.js to ContactData.js
              {...this.props}
            />
          )}
        />
      </div>
    );
  }
}

export default Checkout;
