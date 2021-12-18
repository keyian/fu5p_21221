import React, { useState } from 'react';

//router
import {Route} from 'react-router-dom';

//components
import Header from './components/Header.js';
import Home from './components/Home';
import User from './components/User';
import Item from './components/Item';

//css
import './App.css';

//context
import { AppContextProvider } from "./context/AppContext";


function App(props) {

    return(
      <div className="app">
        <AppContextProvider>
          <Header />
          <Route exact path="/"><Home /></Route>
          <Route path="/user/:user"><User /></Route>
          <Route path="/item/:item"><Item /></Route>
        </AppContextProvider>
      </div>
    );
}

export default App;
