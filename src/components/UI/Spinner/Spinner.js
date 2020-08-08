import React from "react";
import classes from "./Spinner.module.css";

const spinner = () => (
  <div className={classes.Spinner}>
    <div className={[classes.skCube, classes.skCube1].join(" ")}></div>
    <div className={[classes.skCube, classes.skCube2].join(" ")}></div>
    <div className={[classes.skCube, classes.skCube3].join(" ")}></div>
    <div className={[classes.skCube, classes.skCube4].join(" ")}></div>
    <div className={[classes.skCube, classes.skCube5].join(" ")}></div>
    <div className={[classes.skCube, classes.skCube6].join(" ")}></div>
    <div className={[classes.skCube, classes.skCube7].join(" ")}></div>
    <div className={[classes.skCube, classes.skCube8].join(" ")}></div>
    <div className={[classes.skCube, classes.skCube9].join(" ")}></div>
  </div>
);

export default spinner;
