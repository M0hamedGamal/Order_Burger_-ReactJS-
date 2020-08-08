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

class BurgerBuilder extends Component {
  state = {
    // ingredients of burger.
    ingredients: null,
    // Initial total Price.
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
  };

  async componentDidMount() {
    // get ingredients from firebase database.
    const ingredients = await axios.get("/ingredients.json");
    this.setState({
      // ingredients.data --> .data property of response firebase.
      ingredients: ingredients.data,
    });
  }

  // Active/Deactive Order Button.
  updatePurchasableState = (updatedIngredients) => {
    const ingredients = updatedIngredients;

    const sumOfAmount = Object.keys(ingredients)
      .map((igKey) => ingredients[igKey])
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    this.setState({
      purchasable: sumOfAmount > 0,
    });
  };

  // Allow user to add some ingredients.
  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;

    const priceAddition = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
    });

    this.updatePurchasableState(updatedIngredients);
  };

  // Allow user to remove some ingredients.
  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;

    const priceDeduction = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
    });

    this.updatePurchasableState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = async () => {
    // set loading to true.
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
      // Store order into firebase database.
      // Check axios-order.js to see base url.
      await axios.post("/orders.json", custOrder);

      // Stop loading
      this.setState({ loading: false });
      // Close Backdrop and Modal.
      this.setState({ purchasing: false });
    } catch (error) {}
  };

  render() {
    // Active/Deactive Less button.
    const disabledInfo = {
      ...this.state.ingredients,
    };

    // Loop to store all keys with value [true or false] into disabledInfo object.
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = <Spinner />;

    if (this.state.ingredients) {
      burger = (
        <Auxiliary>
          <Burger ingredients={this.state.ingredients} />

          <BuildControls
            price={this.state.totalPrice}
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
          />
        </Auxiliary>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.state.totalPrice}
        />
      );
    }

    if (this.state.loading) {
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
