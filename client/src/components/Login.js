import React, { useEffect, useState } from 'react';
import './styles/Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
//facebook-login
import FacebookLogin from "react-facebook-login";

export default function Login(props) {
    let {login, setLogin, userData, setUserData, picture, setPicture} = props;
    //check if fb login is already stored in local storage...
  function checkFBLogin() {
    console.log('getting userdata: ');

    let userDataLS = (JSON.parse(window.localStorage.getItem('userData'))) || false;
    console.log(userDataLS);

    if(userDataLS) {
      //set state to match local storage... 
      setLogin(true);
      setUserData(userDataLS);
      setPicture(userDataLS.picture);
    }  else {
      setLogin(false);
    }
  }

  //receive user fb login response data, set local storage
  function setUserLocalStorage(userData){
    console.log('setting userdata: ', userData);
    window.localStorage.setItem('userData', JSON.stringify(userData));

  }

  const responseFacebook = (response) => {
    //monitoring
    console.log("in response");

    
     
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      console.log("identifying response access token?");
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
      //throw the crucial stuff into local storage...
      setUserLocalStorage(response.data);
    }).catch((e) => {
      console.log("Error saving user: ", e);
    })
  };

    useEffect(() => {checkFBLogin() }, []);

    return(
        <div>
            {(login) ? 
            <Link to={{pathname: `/user/${userData._id}`, state: {user: userData}}} >
            <div id="loginDiv">
                <img alt="facebook profile photo" src={picture}/>
                <span id="loginName">{userData.name}</span>
            </div>
            </Link> 
            : 
            <FacebookLogin appId="733666113451028" autoLoad={true} fields="name,email,picture" callback={responseFacebook} />
        }
        </div>
    );
}