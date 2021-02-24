import React, { useEffect } from 'react';
import axios from 'axios';

import ItemForm from './components/ItemForm.js';
import ItemMap from './components/ItemMap.js';
import './App.css';
//this is a test commit  to check an internal git problem.
function App() {

  useEffect(() => {
    getItems();
  })

  const getItems = () => {
    axios.get('/api')
      .then((response) => {
        console.log('Data has been received');
      })
      .catch(() => {
        alert('Error retrieving data!**!');
      })
  }

    return(
      <div className="app">
        <h2>Under 5</h2>
        <ItemForm />
        <ItemMap />
      </div>
    );
}

export default App;
