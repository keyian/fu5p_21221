import React from 'react';
import './../App.css';

const Button = (props) => {
  return (
    <button className={props.className} id={props.id} onClick={props.onClick}>
      <span>{props.children}</span>
    </button>
  )
}

export default Button;