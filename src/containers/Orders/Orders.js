import React, { Component } from "react";
import Order from "../../components/Order/Order";
import axios from "../../axios-order";
import WithError from "../../hoc/WithError/WithError";

class Orders extends Component {
  state = {
    orders: [],
    loading: true,
  };

  async componentDidMount() {
    try {
      // Fetch orders from firebase database.
      let fetchedData = await axios.get("/orders.json");

      const fetchedOrders = [];
      // .data --> property of firebase when getting data from it.
      for (let key in fetchedData.data) {
        // Retriving data from firebase is as Object not Array.
        fetchedOrders.push({
          // key in this case is the header that includes order info.
          ...fetchedData.data[key],
          // make id is unique.
          id: key,
        });
      }

      this.setState({
        loading: false,
        orders: fetchedOrders,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    return (
      <div>
        {/* Loop on orders & send it to Order Component. */}
        {this.state.orders.map((order) => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={+order.price}
          />
        ))}
      </div>
    );
  }
}

export default WithError(Orders, axios);
