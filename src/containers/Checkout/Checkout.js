import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class Checkout extends Component {
  checkoutCanceledHandler = () => {
    // console.log(this.props);
    // goBack is a function into history props get from Route Component [Check App.js].
    // goBack to the previous page into the stack of pages.
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    /*
          Take a look on it.
          console.log(this.props.history);
          console.log(this.props.match);
          console.log(this.props.location); 
        */
    this.props.history.push(this.props.match.path + "/contact-data");
  };

  render() {
    // redirect user to root if user try to reach Checkout page from URL [because ingredients will be null].
    let summary = <Redirect to="/" />;
    if (this.props.ings) {
      // Redirect to orders after purchasing burger.
      const purchasedRedirect = this.props.purchased ? (
        <Redirect to="/orders" />
      ) : null;
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ings}
            checkoutCanceled={this.checkoutCanceledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route
            path={this.props.match.path + "/contact-data"}
            component={ContactData}
          />
        </div>
      );
    }

    return summary;
  }
}

// mapStateToProps --> is a function that receive state as a param & Connect with reducer's state into reducer.js.
// This function gets value of state into reducer & store it into props of this Component.
const mapStateToProps = (state) => {
  return {
    // ings --> name of prop that will work with into this Component [this.props.ctr] & ings get from state of reducer.js.
    // burgerBuilder and order are sub states. check index.js.
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
  };
};

export default connect(mapStateToProps)(Checkout);
