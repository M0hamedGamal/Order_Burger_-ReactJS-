import React from "react";

import classes from "./Burger.module.css";

import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";

/*
Burger Component contains:
BurgerIngredient Component.
*/
const burger = (props) => {
  // Object.keys() --> convert keys of object to be strings into array.
  let transformedIngredients = Object.keys(props.ingredients)
    .map((igKey) => {
      // Array(1) --> [undefined] | Array(2) --> [undefined, undefined]
      // props.ingredients[igKey] --> value of object. (in our case, this is an amount of ingredients.)  ex. 1 salad, 2 bacon
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        // key={igKey + i} --> unique key by adding a various index.
        return <BurgerIngredient key={igKey + i} type={igKey} />;
      });
    })
    /* reduce method work on transformedIngredients array takes 2 args [1st --> callback, 2nd --> initial value of arr]. 
       arr --> refers to transformedIngredients array with initial value ( 2nd argment '[]' ).
       el  --> refers to each element into transformedIngredients array. 
    */
    .reduce((arr, el) => {
      // return to store arr into transformedIngredients array.
      return arr.concat(el);
    }, []);

  // Try to console with/without .reduce method.
  // console.log(transformedIngredients);

  // Check if after using reduce method, the length of transformedIngredients array = 0 [Meanning no ingredients into burger].
  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please Add Some ingredients</p>;
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default burger;
