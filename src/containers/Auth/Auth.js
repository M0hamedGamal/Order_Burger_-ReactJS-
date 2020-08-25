import React, { Component } from "react";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./Auth.module.css";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";

class Auth extends Component {
  state = {
    // controls that contains: keys, type, typeOfText [text or password], placeholder, value, validation, and touched  for individual input.
    controls: {
      //[value] of elementType, [key&value] of elementConfig, and [key&value] of value, is for use them into Input Component as HTML properties.
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Mail Address",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
    isSignup: true,
  };

  // When change input field.
  // inputIdentifier is [name, email, country,... and so on]
  inputChangedHandler = (event, inputIdentifier) => {
    // updatedControls is the value of [Controls]
    const updatedControls = {
      ...this.state.controls,
      [inputIdentifier]: {
        ...this.state.controls[inputIdentifier],
        // update value property by data that user typed.
        value: event.target.value,
        // update valid property by result of checkValidity method.
        valid: this.checkValidity(
          this.state.controls[inputIdentifier].value,
          this.state.controls[inputIdentifier].validation
        ),
        touched: true,
      },
    };

    // update the state.
    this.setState({ controls: updatedControls });
  };

  // Own Validation.
  checkValidity = (value, rule) => {
    let isValid = false;

    // Check for empty inputs.
    if (rule.required) {
      isValid = value.trim() !== "";
    }

    // Check for length of Password.
    if (rule.minLength) {
      isValid = value.length >= rule.minLength;
    }

    // Check for email.
    if (rule.isEmail) {
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      isValid = re.test(String(value));
    }

    return isValid;
  };

  submitHandler = (event) => {
    event.preventDefault();

    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup
    );
  };

  SwitchSignupHandler = () => {
    this.setState((pervState) => {
      return {
        isSignup: !pervState.isSignup,
      };
    });
  };

  render() {
    const formElArray = [];
    for (let key in this.state.controls) {
      formElArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = formElArray.map((formElement) => (
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
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }

    let showError = null;
    if (this.props.error) {
      showError = this.props.error;
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to="/" />;
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        <p>{showError}</p>
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">
            {this.state.isSignup ? "SIGN UP" : "LOG IN"}
          </Button>
        </form>
        <Button clicked={this.SwitchSignupHandler} btnType="Danger">
          SWITCH TO {this.state.isSignup ? "LOG IN" : "SIGN UP"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
