import React, { useEffect, useState } from 'react';
import axios from 'axios';
//facebook-login
import FacebookLogin from "react-facebook-login";
//components
import ItemForm from './components/ItemForm.js';
import ItemMap from './components/ItemMap.js';
//css
import './App.css';
//helpers
// import fb_response from './helpers/fb_response.js';
// fb_response.bind(this);

function App() {
  //facebook-login hooks
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState({});
  const [picture, setPicture] = useState('');


  const [items, setItems] = useState([]);

  const responseFacebook = (response) => {
    //monitoring
    console.log("in response");
     
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      setLogin(true);
    } else {
      setLogin(false);
    }

    //send request with this body
    const payload = {
      fbid: response.id,
      name: response.name,
      picture: response.picture.data.url,
      email: response.email,
    }

    axios({
      url: '/api/save-user',
      method: 'POST',
      data: payload
    }).then((response) => {
      console.log("we in post-savveeeee");
      setUserData(response.data);
    }).catch((e) => {
      console.log("Error saving user: ", e);
    })
  };


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

    //action
    setItems(items.concat(nuItem));

  }

    useEffect(() => { getItems() }, []);

    return(
      <div className="app">
        {(login) ? <div id="loginDiv"><img alt="facebook profile photo" src={picture}/><span id="loginName">{userData.name}</span></div> : <FacebookLogin appId="733666113451028" autoLoad={true} fields="name,email,picture" callback={responseFacebook} />}
        <h2 class="title">Under 5</h2>
        <div id="map-and-form-holder">
          <div id="map-holder" ><ItemMap items={items} setItems={setItems} /></div>
          <div id="form-holder">{(login)?<ItemForm login={login} addItem={addItemB4Refresh} userData={userData} /> : <h2 class="message">Login w FB Above</h2>}</div>
        </div>  
      </div>
    );
}

export default App;
