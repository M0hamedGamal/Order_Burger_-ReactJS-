import * as actionTypes from "./actionTypes";
import axios from "../../axios-order";

// Sync function for Success fetching data.
export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData,
  };
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START,
  };
};

export const purchaseBurger = (token, order) => {
  return async (dispatch) => {
    // dispatch this function before post order to appear spinner while purchasing.
    dispatch(purchaseBurgerStart());
    try {
      /*  Store order into firebase database.
            Check axios-order.js to see base url [Full URL]. 
            .json --> Important for working with firebase database.
            */
      const response = await axios.post("/orders.json?auth=" + token, order);

      // response.data.name --> get ID of order that generated randomly from firebase.
      console.log(response.data.name);
      dispatch(purchaseBurgerSuccess(response.data.name, order));
    } catch (error) {
      dispatch(purchaseBurgerFail(error));
    }
  };
};

// Sync function for error fetching data.
export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    error: error,
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT,
  };
};

export const fetchOrderStart = () => {
  return {
    type: actionTypes.FETCH_ORDER_START,
  };
};

export const fetchOrderSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDER_SUCCESS,
    orders: orders,
  };
};

export const fetchOrder = (token, userId) => {
  return async (dispatch) => {
    // dispatch this function before fetch order to appear spinner while fetching.
    dispatch(fetchOrderStart());
    try {
      // params for get orders by userId only. [Each user can see his order only].
      // userId --> check rules of firebase database [.indexOn: ["userId"]].
      const queryParams =
        "?auth=" + token + '&orderBy="userId"&equalTo="' + userId + '"';
      // Fetch orders from firebase database.
      // User need to sign in to see Orders.
      // auth=token --> check rules of firebasedatabase.
      let fetchedData = await axios.get("/orders.json" + queryParams);

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
      dispatch(fetchOrderSuccess(fetchedOrders));
    } catch (error) {
      // path of error message provided by firebase.
      dispatch(fetchOrderFail(error));
    }
  };
};

export const fetchOrderFail = (error) => {
  return {
    type: actionTypes.FETCH_ORDER_FAIL,
    error: error,
  };
};
