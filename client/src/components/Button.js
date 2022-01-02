import React from 'react';
import './../App.css';

const Button = (props) => {
  return (
    <button className={props.className} onClick={props.onClick}>
      <span>{props.children}</span>
    </button>
  )
}

export default Button;