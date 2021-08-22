import React, { useEffect, useState } from 'react';
import axios from 'axios';

//router
import {Route} from 'react-router-dom';

//components
import Header from './components/Header.js';
import Home from './components/Home';
import User from './components/User';

//css
import './App.css';


function App(props) {

   //facebook-login hooks
   const [login, setLogin] = useState(true);
   const [userData, setUserData] = useState({});
   const [picture, setPicture] = useState('');
   const hooks = {login, setLogin, userData, setUserData, picture, setPicture};
   
  console.log(props);


    return(
      <div className="app">
        <Header hooks={hooks} />
        <Route exact path="/"><Home login={login} userData={userData} /></Route>
        <Route path="/user/:user" component={User} />
      </div>
    );
}

export default App;
