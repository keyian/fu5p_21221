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
  const [data, setData] = useState({});
  const [picture, setPicture] = useState('');


  const [items, setItems] = useState([]);

  //facebook callback function
  // const responseFacebook = (response) => {
  //   console.log("in response");
  //   console.log(response);
  //   setData(response);
  //   setPicture(response.picture.data.url);
  //   if (response.accessToken) {
  //     setLogin(true);
  //   } else {
  //     setLogin(false);
  //   }
  // }

    const responseFacebook = (response) => {
    //monitor
    console.log("in response");
    //view response
    console.log(response);
    setData(response);
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
    }).catch((e) => {
        console.log("Error saving user: ", e);
    }).then();
    
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
        {(login) ? <img src={picture}/> : <FacebookLogin appId="733666113451028" autoLoad={true} fields="name,email,picture" callback={responseFacebook} />}
        <h2 id="title">Under 5</h2>
        <div id="map-holder" ><ItemMap items={items} setItems={setItems} /></div>
        <div id="form-holder"><ItemForm addItem={addItemB4Refresh} /></div>
      </div>
    );
}

export default App;
