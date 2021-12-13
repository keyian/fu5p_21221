import React, { useEffect } from 'react';
import './styles/Login.css';
import { Link } from 'react-router-dom';
import UserFinder from '../apis/UserFinder.js';
//facebook-login
import FacebookLogin from "react-facebook-login";

export default function Login(props) {
    let {login, setLogin, userData, setUserData, picture, setPicture} = props.hooks;
    //check if fb login is already stored in local storage...
  function checkFBLogin() {
    console.log('getting userdata: ');

    const userDataLS = (JSON.parse(window.localStorage.getItem('userData'))) || false;
    console.log('userdata: ', userDataLS);

    if(userDataLS) {
      console.log('inside userdatals');
      //set state to match local storage... 
      setLogin(true);
      setUserData(userDataLS);
      console.log("post setUserData", userData);

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
    console.log("in fb login response");
    console.log("userd in response fb", userData);
    
    console.log("this is the facebook login response: ", response);
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

    const addUser = async (payload) => {
      try {
        const response = await UserFinder.post('/save-user', payload);
        console.log("response of save-user", response);
        setUserData(payload);
        setUserLocalStorage(payload);
        console.log("adding a user worked!. Here's response: ", response);
      } catch(err) {
        console.log("Error saving user: ", err);
      }
      
    }
    console.log("this is userdata", userData);
    if(!(JSON.parse(window.localStorage.getItem('userData')))) {
      console.log(userData);
      console.log("not user data?");
      addUser(payload);
    }
    
  };

    useEffect(checkFBLogin, []);

    return(
        <div id="outer-login-div">
            {(login) ? 
            <Link to={{pathname: `/user/${userData._id}`, state: {user: userData}}} >
            <div id="login-div">
                <div id="login-img-div" ><img alt="facebook" src={picture}/></div>
                <span id="login-span">{userData.name}</span>
            </div>
            </Link> 
            : 
            <FacebookLogin appId="733666113451028" autoLoad={true} fields="name,email,picture" callback={responseFacebook} />
        }
        </div>
    );
}