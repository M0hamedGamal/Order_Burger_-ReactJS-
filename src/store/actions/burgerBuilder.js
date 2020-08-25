import * as actionTypes from "./actionTypes";
import axios from "../../axios-order";

export const addIngredient = (ingName) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: ingName,
  };
};

export const removeIngredient = (ingName) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: ingName,
  };
};

// Sync function for Success fetching data.
export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients,
  };
};

// It's asyc function cause axios fetch data from API.
export const initIngredients = () => {
  // return function that received dispatch from redux-thunk lib [middleware].
  return async (dispatch) => {
    // Put here async code like fetch data from api.
    try {
      /*  get ingredients from firebase database.
      Check axios-order.js to see base url [Full URL]. 
      .json --> Important for working with firebase database.
      */
      const ingredients = await axios.get("/ingredients.json");
      // call sync code into dispatch method that will work with reducer.
      // ingredients.data --> .data property of response firebase database.
      dispatch(setIngredients(ingredients.data));
      // When catch error.
    } catch (error) {
      // call sync code into dispatch method that will work with reducer.
      dispatch(fetchIngredientsFail());
    }
  };
};

// Sync function for error fetching data.
export const fetchIngredientsFail = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
  };
};
