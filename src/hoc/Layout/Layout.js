import React, { Component } from "react";
import Auxiliary from "../Auxiliary/Auxiliary";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import { connect } from "react-redux";
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
    console.log(this.props);

    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  render() {
    return (
      //HOC.
      <Auxiliary>
        <Toolbar
          isAuth={this.props.isAuthenticated}
          toggleDrawer={this.toggleDrawerHandler}
        />
        <SideDrawer
          isAuth={this.props.isAuthenticated}
          openSideDrawer={this.state.showSideDrawer}
          closedSideDrawer={this.sideDrawerClosedHandler}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </Auxiliary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
