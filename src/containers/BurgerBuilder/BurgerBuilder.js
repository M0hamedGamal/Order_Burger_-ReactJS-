import React, { Component } from "react";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";

import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import axios from "../../axios-order";
import WithError from "../../hoc/WithError/WithError";

// Initial Price for INGREDIENTS.
const INGREDIENTS_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  bacon: 0.7,
  meat: 1.3,
};

/* 
BurgerBuilder Component contains:
Auxiliary, Burger, BuildControls, OrderSummary, Modal, and Spinner Component.
*/
class BurgerBuilder extends Component {
  state = {
    // Initial of Object ingredients of burger {salad, cheese, bacon, meat}.
    ingredients: null,
    // Initial total Price.
    totalPrice: 4,
    // Enable/Disable Order Button.
    purchasable: false,
    // Enable/Disable Backdrop Component.
    purchasing: false,
    // property for Spinner Component.
    loading: false,
  };

  // Internal method allow us to get all ingredients from firebase database.
  async componentDidMount() {
    /*  get ingredients from firebase database.
        Check axios-order.js to see base url [Full URL]. 
        .json --> Important for working with firebase database.
    */
    const ingredients = await axios.get("/ingredients.json");
    this.setState({
      // ingredients.data --> .data property of response firebase database.
      // Return Object of data.
      ingredients: ingredients.data,
    });
  }

  // Disabled Less Button for First Time.
  disabledLessButton = () => {
    // Active/Deactive Less button.
    const disabledInfo = {
      // Copy of ingredients Object.
      ...this.state.ingredients,
    };

    // Loop to store all keys with value [true or false] into disabledInfo object.
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    return disabledInfo;
  };

  // Updating method for Enabling/Disabling Order Button.
  updatePurchasableState = (updatedIngredients) => {
    // updatedIngredients get from addIngredientHandler and removeIngredientHandler methods.
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

    this.setState({
      // change purchasable to true/false to Enable/Disable Order Button.
      purchasable: sumOfAmount > 0,
    });
  };

  // For BuildControls Component.
  // Allow user to add some ingredients.
  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    // Copy of ingredients Object.
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;

    const priceAddition = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
    });

    // Call updatePurchasableState method.
    this.updatePurchasableState(updatedIngredients);
  };

  // For BuildControls Component.
  // Allow user to remove some ingredients.
  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    // Copy of ingredients Object.
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;

    const priceDeduction = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
    });

    // Call updatePurchasableState method.
    this.updatePurchasableState(updatedIngredients);
  };

  // Method for Active Modal & Backdrop Component.
  purchasingHandler = () => {
    this.setState({ purchasing: true });
  };

  // Method for DeActive Modal & Backdrop Component.
  // Press on Cancel Button into OrderSummary Component.
  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  // Press on Continue Button into OrderSummary Component.
  purchaseContinueHandler = async () => {
    // set loading to true to active Spinner Component.
    this.setState({ loading: true });

    // add info of customer.
    const custOrder = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      custInfo: {
        name: "Gemy",
        email: "Gemy@gmail.com",
        address: {
          city: "October",
          street: "El-Wagih Center",
        },
      },
      deliveryMethod: "fastest",
    };

    try {
      /*  Store order into firebase database.
          Check axios-order.js to see base url [Full URL]. 
          .json --> Important for working with firebase database.
      */
      await axios.post("/orders.json", custOrder);

      // Stop loading & Close Backdrop and Modal.
      this.setState({ loading: false, purchasing: false });
    } catch (error) {}
  };

  render() {
    // Initial value of orderSummary when ingredients didn't come from firebase database yet.
    let orderSummary = null;

    // Initial value of burger when ingredients didn't come from firebase database yet, Appear Spinner for user.
    let burger = <Spinner />;

    // Check if ingredients were come from firebase database.
    if (this.state.ingredients) {
      // Change value of burger.
      burger = (
        <Auxiliary>
          <Burger ingredients={this.state.ingredients} />

          <BuildControls
            price={this.state.totalPrice}
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={this.disabledLessButton()}
            purchasable={this.state.purchasable}
            ordered={this.purchasingHandler}
          />
        </Auxiliary>
      );
      // Change value of orderSummary.
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }
    // When Press on Continue Button into OrderSummary Component.
    if (this.state.loading) {
      // Appear Spinner for user instead the order.
      orderSummary = <Spinner />;
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

export default WithError(BurgerBuilder, axios);
