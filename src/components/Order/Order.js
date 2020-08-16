import React from "react";
import classes from "./Order.module.css";

const order = (props) => {
  const ingredients = [];

  // Loop onto Object of ingredients & push it into Array.
  for (let ingredinetsName in props.ingredients) {
    ingredients.push({
      name: ingredinetsName,
      amount: props.ingredients[ingredinetsName],
    });
  }

  const ingredientOutput = ingredients.map((ig) => {
    return (
      <span
        key={ig.name}
        style={{
          textTransform: "capitalize",
          display: "inline-block",
          margin: "0 8px",
          padding: "5px",
          border: "1px solid #ccc",
        }}
      >
        {ig.name} ({ig.amount})
      </span>
    );
  });

  return (
    <div className={classes.Order}>
      <p>Ingredinets: {ingredientOutput}</p>
      <p>
        Price: <strong>{props.price.toFixed(2)}$</strong>
      </p>
    </div>
  );
};

export default order;
