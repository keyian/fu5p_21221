import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { IndexRoute, Router, Route, HashRouter } from 'react-router-dom';

//import components that Router will link to...
import App from './App';


ReactDOM.render(
  // <React.StrictMode>
  <HashRouter>
    <Route path="/" component={App} />
  </HashRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
