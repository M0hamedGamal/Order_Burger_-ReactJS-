import React, { Component } from "react";
import Auxiliary from "../Auxiliary/Auxiliary";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

/* 
Layout Component contains:
Toolbar, SideDrawer, and BuilderBurger Component
*/
//HOC.
class Layout extends Component {
  state = {
    // show/hide SideDrawer property.
    showSideDrawer: false,
  };

  // Close SideDrawer for Backdrop Component.
  sideDrawerClosedHandler = () => {
    this.setState({
      showSideDrawer: false,
    });
  };

  // Open/Close SideDrawer by toggle button for DrawerToggle Component.
  toggleDrawerHandler = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  render() {
    return (
      //HOC.
      <Auxiliary>
        <Toolbar toggleDrawer={this.toggleDrawerHandler} />
        <SideDrawer
          openSideDrawer={this.state.showSideDrawer}
          closedSideDrawer={this.sideDrawerClosedHandler}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </Auxiliary>
    );
  }
}

export default Layout;
