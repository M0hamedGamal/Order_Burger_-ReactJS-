import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import burgerBuilderReducer from "./store/reducers/burgerBuilder";
import orderReducer from "./store/reducers/order";
import authReducer from "./store/reducers/auth";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

// composeEnhancers --> compose middlewares like [div tools redux & thunk lib] into one middleware to use it into createStore function.
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// combine two or more Reducers into one Reducer with one global state.
const rootReducer = combineReducers({
  // burgerBuilder and order are sub states.
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer,
});
/* createStore --> is a function that takes params: 
   1st --> reducer & work with reducer & state. 
   2nd --> applyMiddleware function that allow thunk middleware for async codes.
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() --> allow redux divTools for this application. */
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

/* wrap all of components with 'BrowserRouter Component' to allow Routes for all of them.*/
const app = (
  // Provider --> is a HOC for everything of Application, and it takes our store [that takes reducer as a param] into its store property.
  // store prop makes all of Components connect with state into reducer.js.
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
