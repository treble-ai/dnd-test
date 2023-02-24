import React, { Component } from "react";
/*
  props:
    - firtstComponent reactComponent: one component to display
    - secondComponent reactComponent: one component to display
*/

const ABcomponent = (props) => {
  const firstComponent = props.firstComponent;
  const secondComponent = props.secondComponent;

  const ABdeciderFuction = () => {

    let me = JSON.parse(localStorage.getItem("me"))
    if (!me) me = { 'id' : 1 }

    let id = me['id'];

    if (id % 2 == 0) {

      return false;

    } else {

      return true;

    }
  
  };

  let decider = ABdeciderFuction();

  if (decider) {
    return firstComponent;
  } else {
    return secondComponent;
  }
};

export default ABcomponent;
