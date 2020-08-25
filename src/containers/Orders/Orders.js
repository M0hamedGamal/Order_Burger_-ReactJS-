import React, { Component } from "react";
import Order from "../../components/Order/Order";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import ErrorHandler from "../../hoc/ErrorHandler/ErrorHandler";

class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId);
  }

  render() {
    // Initial value of order when user didn't sign in [There's no token for user],
    // If there's error Call ErrorHandler Component else Appear Spinner for user.
    let order =
      !this.props.token || this.props.error ? <ErrorHandler /> : <Spinner />;

    if (!this.props.loading && !this.props.error && this.props.token) {
      order = (
        <div>
          {/* Loop on orders & send it to Order Component. */}
          {this.props.orders.map((order) => (
            <Order
              key={order.id}
              ingredients={order.ingredients}
              price={+order.price}
            />
          ))}
        </div>
      );
    }

    return order;
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    error: state.order.error,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token, userId) =>
      dispatch(actions.fetchOrder(token, userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
