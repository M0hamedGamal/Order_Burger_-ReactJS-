import React from "react";
import classes from "./Modal.module.css";
import Auxiliary from "../../../hoc/Auxiliary/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";

const modal = (props) => (
  <Auxiliary>
    <Backdrop show={props.show} clicked={props.cancelledOrder} />
    <div
      className={classes.Modal}
      style={{
        transform: props.show ? "translateY(0vh)" : "translateY(-100vh)",
        opacity: props.show ? "1" : "0",
      }}
    >
      {props.children}
    </div>
  </Auxiliary>
);

// React.memo --> will not update component else props are changed ex. [show changed from 'false' to 'true'] then will update the component.
export default React.memo(modal);
