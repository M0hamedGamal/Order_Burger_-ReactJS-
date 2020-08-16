import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import axios from "../../../axios-order";
import Input from "../../../components/UI/Input/Input";
import classes from "./ContactData.module.css";

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
        value: "",
        validation: {
          required: true,
        },
        valid: true,
      },
    },
    formIsValid: false,
    loading: false,
  };

  orderHandler = async (event) => {
    console.log(this.props);
    event.preventDefault();

    // set loading to true to active Spinner Component.
    this.setState({ loading: true });

    const formData = {};

    for (let formElIDentifier in this.state.orderForm) {
      // I need only store key [name, country, and so on] & value of it to store them into firebase.
      formData[formElIDentifier] = this.state.orderForm[formElIDentifier].value;
    }

    // create order that will be sent to firebase database.
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      orderData: formData,
    };

    try {
      /*  Store order into firebase database.
          Check axios-order.js to see base url [Full URL]. 
          .json --> Important for working with firebase database.
      */
      await axios.post("/orders.json", order);

      // Stop loading & Close Backdrop and Modal.
      this.setState({ loading: false });
      this.props.history.push("/orders");
    } catch (error) {
      this.setState({ loading: false });
    }
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
    if (this.state.loading) {
      form = <Spinner />;
    }

    return <div className={classes.ContactData}>{form}</div>;
  }
}

export default ContactData;
