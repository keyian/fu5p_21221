import React from 'react';
import './../App.css';

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      <span>{props.children}</span>
    </button>
  )
}

export default Button;