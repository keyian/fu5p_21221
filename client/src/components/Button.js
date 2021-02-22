import React from 'react';
import './../App.css';
import {createUseStyles} from 'react-jss';

// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const useStyles = createUseStyles({
    myButton: {
        color: '#fff',
        margin: {
        // jss-plugin-expand gives more readable syntax
        top: 5, // jss-plugin-default-unit makes this 5px
        right: 0,
        bottom: 0,
        left: '1rem'
        },
        padding: 5,
        '& span': {
        // jss-plugin-nested applies this to a child span
        fontWeight: 'bold' // jss-plugin-camel-case turns this into 'font-weight'
        }
    },
    myLabel: {
        fontStyle: 'italic'
    }
})

const Button = ({children}) => {
  const classes = useStyles()
  return (
    <button className={classes.myButton}>
      <span className={classes.myLabel}>{children}</span>
    </button>
  )
}

export default Button;