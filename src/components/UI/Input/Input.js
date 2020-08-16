import React from "react";
import classes from "./Input.module.css";

const input = (props) => {
  const inputClasses = [classes.InputElement];

  // Check if it invalid & touched.
  if (props.invalid && props.touched) {
    // add class Invalid.
    inputClasses.push(classes.Invalid);
  }

  let inputEl = null;

  switch (props.elementtype) {
    case "input":
      inputEl = (
        <input
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;

    case "textarea":
      inputEl = (
        <textarea
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;

    case "select":
      inputEl = (
        <select
          className={inputClasses.join(" ")}
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;

    default:
      inputEl = (
        <input
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.lable}:</label>
      {inputEl}
    </div>
  );
};

export default input;
