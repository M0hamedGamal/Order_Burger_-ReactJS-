import React, { Component } from "react";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";

import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import ErrorHandler from "../../hoc/ErrorHandler/ErrorHandler";

/* 
BurgerBuilder Component contains:
Auxiliary, Burger, BuildControls, OrderSummary, Modal, and Spinner Component.
*/
class BurgerBuilder extends Component {
  state = {
    // Enable/Disable Backdrop Component.
    purchasing: false,
    // property for Spinner Component.
    // loading: false,
  };

  // Internal method allow us to get all ingredients from firebase database.
  componentDidMount() {
    this.props.onInitIngredient();
  }

  // Disabled Less Button for First Time.
  disabledLessButton = () => {
    // Active/Deactive Less button.
    const disabledInfo = {
      // Copy of ingredients Object.
      ...this.props.ings,
    };

    // Loop to store all keys with value [true or false] into disabledInfo object.
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    return disabledInfo;
  };

  // Updating method for Enabling/Disabling Order Button.
  updatePurchasableState = (updatedIngredients) => {
    // updatedIngredients get from onIngredientAddedHandler and removeIngredientHandler methods.
    const ingredients = updatedIngredients;

    // Object.keys() --> convert keys of object ingredients to be strings into array.
    const sumOfAmount = Object.keys(ingredients)
      // ingredients[igKey] --> value of key (amount of ingredient)
      .map((igKey) => ingredients[igKey])
      /* reduce method work on sumOfAmount array takes 2 args [1st --> callback, 2nd --> initial value]. 
    sum --> refers to sumOfAmount array with initial value ( 2nd argment '0' ).
    el  --> refers to each element into sumOfAmount array. 
    */
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    return sumOfAmount > 0;
  };

  // Method for Active Modal & Backdrop Component.
  purchasingHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.history.push("/auth");
    }
  };

  // Method for DeActive Modal & Backdrop Component.
  // Press on Cancel Button into OrderSummary Component.
  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  // Press on Continue Button into OrderSummary Component.
  purchaseContinueHandler = () => {
    // reset purchased to false for preventing redirected to root. Check [Checkout.js file]
    this.props.onInitPurchase();
    // Get addition props from Route into App.js.
    // Now you can see props/history/push --> push page into stack of pages to add new page for the stack without using Redirect Component.
    // console.log(this.props.history);
    this.props.history.push("/checkout");
  };

  render() {
    // Initial value of orderSummary when ingredients didn't come from firebase database yet.
    let orderSummary = null;

    // Initial value of burger when ingredients didn't come from firebase database yet,
    // If there's error Call ErrorHandler Component else Appear Spinner for user.
    let burger = this.props.error ? <ErrorHandler /> : <Spinner />;

    // Check if ingredients were come from firebase database.
    if (this.props.ings) {
      // Change value of burger.
      burger = (
        <Auxiliary>
          <Burger ingredients={this.props.ings} />

          <BuildControls
            price={this.props.price}
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={this.disabledLessButton()}
            purchasable={this.updatePurchasableState(this.props.ings)}
            ordered={this.purchasingHandler}
            isAuth={this.props.isAuthenticated}
          />
        </Auxiliary>
      );
      // Change value of orderSummary.
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          price={this.props.price}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }

    return (
      <Auxiliary>
        <Modal
          show={this.state.purchasing}
          cancelledOrder={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Auxiliary>
    );
  }
}

// mapStateToProps --> is a function that receive state as a param & Connect with reducer's state into reducer.js.
// This function gets value of state into reducer & store it into props of this Component.
const mapStateToProps = (state) => {
  return {
    // ings --> name of prop that will work with into this Component [this.props.ings] & ings get from state of reducer.js.
    // burgerBuilder are sub states. check index.js.
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

// mapDispatchToProps --> is a function that receive dispatch function as a param & Connect with reducer's action into reducer.js.
// This function updates value of state into reducer through action prop.
const mapDispatchToProps = (dispatch) => {
  return {
    // 'type' property is V.IMPORTANT for dispatch function to work with action prop into reducer.js. Don't forget it.
    // type & val can be connected by reducer's action prop into reducer.js.
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) =>
      dispatch(actions.removeIngredient(ingName)),
    onInitIngredient: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
  };
};

// connect --> method [from react-redux lib.] takes mapStateToProps & mapDispatchToProps as args
// to connect redux with Counter Component & connect global state.
export default connect(mapStateToProps, mapDispatchToProps)(BurgerBuilder);
