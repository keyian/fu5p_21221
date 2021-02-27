import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ItemForm from './components/ItemForm.js';
import ItemMap from './components/ItemMap.js';
import './App.css';
//this is a test commit  to check an internal git problem.
function App() {
  const [items, setItems] = useState([]);
  const getItems = () => {
    axios.get('/api/getItems')
      .then((response) => {
        setItems(response);
        console.log(response, 'Data has been received');
      })
      .catch(() => {
        alert('Error retrieving data!**!');
      })
  }
  useEffect(() => { getItems() }, [] );

    return(
      <div className="app">
        <h2>Under 5</h2>
        <ItemForm />
        <ItemMap items={items}/>
      </div>
    );
}

export default App;
