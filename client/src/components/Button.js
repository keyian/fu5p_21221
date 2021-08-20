import React from 'react';
import './../App.css';

const Button = ({children}) => {
  return (
    <button onClick={children.onClick}>
      <span>{children}</span>
    </button>
  )
}

export default Button;