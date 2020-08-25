import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import classes from "./ContactData.module.css";
import { connect } from "react-redux";
import * as orderAction from "../../../store/actions/index";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";

class ContactData extends Component {
  state = {
    // Order form that contains: keys, type, typeOfText [text or password], placeholder, value, validation, and touched  for individual input.
    orderForm: {
      name: {
        //[value] of elementType, [key&value] of elementConfig, and [key&value] of value, is for use them into Input Component as HTML properties.
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your E-Mail",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder: "ZIP Code",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        value: "fastest",
        validation: {
          required: true,
        },
        valid: true,
      },
    },
    formIsValid: false,
  };

  orderHandler = (event) => {
    event.preventDefault();

    const formData = {};

    for (let formElIDentifier in this.state.orderForm) {
      // I need only store key [name, country, and so on] & value of it to store them into firebase.
      formData[formElIDentifier] = this.state.orderForm[formElIDentifier].value;
    }

    // create order that will be sent to firebase database.
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId,
    };

    this.props.onOrderBurger(this.props.token, order);
  };

  // When change input field.
  // inputIdentifier is [name, email, country,... and so on]
  inputChangedHandler = (event, inputIdentifier) => {
    // updatedOrderForm is the value of [orderForm]
    const updatedOrderForm = {
      ...this.state.orderForm,
    };

    // updatedFormElement is the value of [name, email, country,... and so on]
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier],
    };

    // update value property by data that user typed.
    updatedFormElement.value = event.target.value;

    // update valid property by result of checkValidity method.
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );

    updatedFormElement.touched = true;
    // update updatedOrderForm[key] with new value updated by updatedFormElement.
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;

    for (let inputIdentifier in updatedOrderForm) {
      // if one of inputs has valid 'false' that will convert formIsValid var to be 'false' & will return false at the end.
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    // update the state.
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  // Own Validation.
  checkValidity = (value, rule) => {
    let isValid = false;

    // Check for empty inputs.
    if (rule.required) {
      isValid = value.trim() !== "";
    }

    // Check for length of ZIP Code.
    if (rule.minLength && rule.maxLength) {
      isValid =
        value.length === rule.minLength && value.length === rule.maxLength;
    }

    // Check for email.
    if (rule.isEmail) {
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      isValid = re.test(String(value).toLowerCase());
    }

    return isValid;
  };

  render() {
    const formElementsArray = [];

    // key is [name, email, country,... and so on]
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        // get value of key & store it into config.
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        <h4>Enter your contact data.</h4>
        {formElementsArray.map((formElement) => (
          <Input
            key={formElement.id}
            lable={formElement.id}
            elementtype={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}

        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    // if it true. appear Spinner instead info.
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        {!this.props.token ? <ErrorHandler /> : form}
      </div>
    );
  }
}

// mapStateToProps --> is a function that receive state as a param & Connect with reducer's state into reducer.js.
// This function gets value of state into reducer & store it into props of this Component.
const mapStateToProps = (state) => {
  return {
    // ings --> name of prop that will work with into this Component [this.props.ctr] & ings get from state of reducer.js.
    // ingsReducer and resReducer are sub states. check index.js.
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (token, orderData) =>
      dispatch(orderAction.purchaseBurger(token, orderData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactData);
