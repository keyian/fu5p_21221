import React, { useEffect, useState } from 'react';
import axios from 'axios';

//components
import ItemForm from './components/ItemForm.js';
import ItemMap from './components/ItemMap.js';
import ItemFeed from './components/ItemFeed.js';
import Login from './components/Login.js';
import Header from './components/Header.js';
//css
import './App.css';
//helpers
// import fb_response from './helpers/fb_response.js';
// fb_response.bind(this);

function App() {
  //facebook-login hooks
  const [login, setLogin] = useState(true);
  const [userData, setUserData] = useState({});
  const [picture, setPicture] = useState('');

  const [items, setItems] = useState([]);

  


  function getItems() {
    if(items.length === 0){
        axios.get('/api/getItems')
        .then((response) => {
          setItems(response.data);
        })
        .catch((err) => {
          console.log('Error retrieving getItems data!**: ', err);
        });
    }
  }


  //trigger this when an item is added...
  const addItemB4Refresh = (nuItem) => {

    //action
    setItems(items.concat(nuItem));

  }

    useEffect(getItems, []);

    return(
      <div className="app">
        <Header hooks={{login, setLogin, userData, setUserData, picture, setPicture}}  />
        <ItemMap items={items} setItems={setItems} />
        {(login)?<ItemForm login={login} addItem={addItemB4Refresh} userData={userData} /> : <h2 className="message">Login w FB Above</h2>}
        <div id="itemfeed-container">
          <ItemFeed items={items} user={userData} login={login} />
        </div>
      </div>
    );
}

export default App;
