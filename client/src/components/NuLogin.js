import React, { useContext, useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Register from './Register';
import UserFinder from '../apis/UserFinder.js';
import Draggable from 'react-draggable';
//facebook-login

import { AppContext } from '../context/AppContext';

//import helper
import manicureUserData from '../helpers/manicureUserData';


export default function NuLogin(props) {

  const {login, setLogin, userData, setUserData} = useContext(AppContext);

  const [inputs, setInputs] = useState({email: "", password: ""});
  const [showLogin, setShowLogin] = useState(false);    
  const { email, password } = inputs;


  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const credentials = { email: email, password: password };
      const response = await UserFinder.post("/authentication/login", credentials);

      console.log("this is  response in login ", response);
      if (response.data.jwtToken) {
        localStorage.setItem("token", response.data.jwtToken);
        const manicuredUser = manicureUserData([response.data.user]);
        setUserData(manicuredUser);
        localStorage.setItem("userData", manicuredUser);

        setLogin(true);
        // toast.success("Logged in Successfully");
      } else {
        setLogin(false);
        // toast.error(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAuthenticated = () => {
    const runCheckAuthenticated = async () => {
      try {
        console.log("token?", localStorage.token);
        const res = await UserFinder.post("/authentication/verify", {}, {
          headers: { jwt_token: localStorage.token }}
        );
        console.log("we're in the check authenticated...", res);
        // const parseRes = await res.json();
        
    
        // (res.data.verified === true) ? setUserData(res.datasetLogin(true) : setLogin(false);
      } catch (err) {
        console.log("Error in check authenticated", err);
      }
    }

    runCheckAuthenticated();
  };

  const getUserData = () => {
    
    const runGetUserData = async () => {
      try{
        if((localStorage.token)) {
          console.log("local storage token in get user data", localStorage.token);
          const user = await UserFinder.post('/get-user', {}, {
            headers: { jwt_token: localStorage.token }
          });

          console.log("this is user in get user data", user.data.user);
          const manicuredUser = manicureUserData(user.data.user);
          console.log("this is manicured user", manicuredUser);
          setUserData(manicuredUser);
          setLogin(true);
        }
      } catch(err) {
        console.log("err getting user data", err);
      }
      
    }

    runGetUserData();
  }

  

  // useEffect(checkAuthenticated, []);
  useEffect(getUserData, [login]);
  return(

    <Draggable>
      <div>
          <h1 className="mt-5 text-center">Login</h1>
          <form onSubmit={onSubmitForm}>
              <input
              type="text"
              name="email"
              value={email}
              onChange={e => onChange(e)}
              className="form-control my-3"
              />
              <input
              type="password"
              name="password"
              value={password}
              onChange={e => onChange(e)}
              className="form-control my-3"
              />
              <button className="btn btn-success btn-block">Submit</button>
          </form>
        </div>
    </Draggable>
        
  );
}