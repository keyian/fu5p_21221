import React from 'react';
import './../App.css';

const Button = ({children}) => {

  return (
    <button>
      <span>{children}</span>
    </button>
  )
}

export default Button;