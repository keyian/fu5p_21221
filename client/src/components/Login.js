import React, { useContext, useEffect } from 'react';
import './styles/Login.css';
import { Link } from 'react-router-dom';
import UserFinder from '../apis/UserFinder.js';
//facebook-login
import FacebookLogin from "react-facebook-login";

import { AppContext } from '../context/AppContext';

//import helper
import manicureUserData from '../helpers/manicureUserData';


export default function Login() {

  const {login, setLogin, userData, setUserData} = useContext(AppContext);


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
    if (response.accessToken) {
      console.log("identifying response access token?");

      //send request with this body
      const payload = {
        fbid: response.id,
        name: response.name,
        picture: response.picture.data.url,
        email: response.email,
      }

      const addUser = async (payload) => {
        try {
          const user = await UserFinder.post('/save-user', payload);
          console.log("userdata in adduser", userData);
          const manicuredUser = manicureUserData(user.data.user)
          setUserData(manicuredUser);
          // setUserData(user.data.user[0])
          setLogin(true);
          setUserLocalStorage(manicuredUser);
          // setUserLocalStorage(payload);
          console.log("adding a user worked!. Here's response: ", user);
        } catch(err) {
          console.log("Error saving user: ", err);
        }
        
      }

      addUser(payload);

    } else {
      setLogin(false);
    }
    
  };

  function facebookLogout() {
    setLogin(false);
    setUserData({});
  }
 

    useEffect(checkFBLogin, []);

    return(
        <div id="outer-login-div">
            {(login) ? 
            <div>
              <Link to={{pathname: `/user/${userData.facebook_id}`}} >
              <div id="login-div">
                  <div id="login-img-div" ><img alt="facebook" src={userData.picture}/></div>
                  <span id="login-span">{userData.name}</span>
              </div>
              </Link> 
              <div id="logout-div">
                <a href="#" onClick={facebookLogout}>logout</a>
              </div>
            </div>
            : 
            <FacebookLogin appId="733666113451028" autoLoad={false} fields="name,email,picture" callback={responseFacebook} />
        }
        </div>
    );
}