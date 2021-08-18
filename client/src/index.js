import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Link, Switch, Route, HashRouter } from 'react-router-dom';

//import components that Router will link to...
import App from './App';
import User from './components/User';



  // <React.StrictMode>
  ReactDOM.render((
    <HashRouter>
      <Link to={'/'} replace><h2 className="title">Under 5</h2></Link>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/user/:user" component={User} />
        <Route component={App} />
      </Switch>
    </HashRouter>),
  document.getElementById('root'));
  {/* // </React.StrictMode>, */}
  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


