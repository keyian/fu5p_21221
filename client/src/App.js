import React, { useState } from 'react';

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
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState({});
  const [picture, setPicture] = useState('');
  const hooks = {login, setLogin, userData, setUserData, picture, setPicture};

  
   
  console.log(props);


    return(
      <div className="app">
        <Header hooks={hooks} />
        <Route exact path="/"><Home login={login} userData={userData} /></Route>
        <Route path="/user/:user"><User login={login} userData={userData} /></Route>
      </div>
    );
}

export default App;
