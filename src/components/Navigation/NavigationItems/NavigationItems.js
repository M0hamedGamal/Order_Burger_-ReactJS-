import React from "react";
import classes from "./NavigationItems.module.css";
import NavigationItem from "../NavigationItem/NavigationItem";

/* 
NavigationItems Component contains:
NavigationItem Component
*/
const navigationItems = () => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/" active>
      Builder Burger
    </NavigationItem>
    <NavigationItem link="/">Checkout</NavigationItem>
  </ul>
);

export default navigationItems;
