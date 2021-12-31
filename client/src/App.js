import React, { useState } from 'react';

//router
import {Route} from 'react-router-dom';

//components
import Header from './components/Header.js';
import Home from './components/Home';
import User from './components/User';
import Item from './components/Item';

//react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//css
import './App.css';

//context
import { AppContextProvider } from "./context/AppContext";



function App(props) {
    return(
      <div className="app">
        <AppContextProvider>
          <Container>
            <Row><Header /></Row>
            <Row>
              <Route exact path="/"><Home /></Route>
              <Route path="/user/:user"><User /></Route>
              <Route path="/item/:item"><Item /></Route>
            </Row>
          </Container>
          
        </AppContextProvider>
      </div>
    );
}

export default App;
