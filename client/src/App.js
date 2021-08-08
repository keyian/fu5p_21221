import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ItemForm from './components/ItemForm.js';
import ItemMap from './components/ItemMap.js';
import './App.css';
//this is a test commit  to check an internal git problem.
function App() {
  const [items, setItems] = useState([]);
  const [test, setTest] = useState("bf");

  const getItems = () => {
    axios.get('/api/getItems')
      .then((response) => {
        setItems(response.data);
      })
      .catch(() => {
        alert('Error retrieving data!**!');
      })
  }


  //trigger this when an item is added...
  const addItemB4Refresh = (nuItem) => {
    console.log("nu Item: ", nuItem);
    console.log("items: ", items);
    items.push(nuItem);
    setItems(items);
    setTest(Math.random());
    console.log("Iamhere");
  }

  useEffect(() => { getItems() }, [] );

    return(
      <div className="app">
        <h2>Under 5</h2>
        <ItemForm addItem={addItemB4Refresh} />
        <ItemMap items={items} setItems={setItems} test={test} setTest={setTest}/>
      </div>
    );
}

export default App;
