import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Switch, Route, HashRouter } from 'react-router-dom';

//import components that Router will link to...
import App from './App';
import User from './components/User';



  ReactDOM.render((
    <HashRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/user/:user" component={User} />
        <Route component={App} />
      </Switch>
    </HashRouter>),
  document.getElementById('root'));
  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


