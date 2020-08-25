// Get all exports functions from seperated files into one file [index.js]
export {
  addIngredient,
  removeIngredient,
  initIngredients,
} from "./burgerBuilder";
export { purchaseBurger, purchaseInit, fetchOrder } from "./order";
export { auth, logout, authCheckState } from "./auth";
