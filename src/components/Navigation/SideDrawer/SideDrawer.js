import React from "react";
import classes from "./SideDrawer.module.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import Backdrop from "../../UI/Backdrop/Backdrop";
import Auxiliary from "../../../hoc/Auxiliary/Auxiliary";

/* 
SideDrawer Component contains:
Auxiliary, Backdrop, Logo, and NavigationItems Component
*/
const sideDrawer = (props) => {
  // Css file By default called Close class.
  let attachedClasses = [classes.SideDrawer, classes.Close];

  // if openSideDrawer is true ?
  if (props.openSideDrawer) {
    // Css file called Open class.
    attachedClasses = [classes.SideDrawer, classes.Open];
  }
  return (
    <Auxiliary>
      <Backdrop show={props.openSideDrawer} clicked={props.closedSideDrawer} />
      <div className={attachedClasses.join(" ")}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems />
        </nav>
      </div>
    </Auxiliary>
  );
};

export default sideDrawer;
