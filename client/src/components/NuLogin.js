import React, { useContext, useEffect, useState } from 'react';
import UserFinder from '../apis/UserFinder.js';
import Draggable from 'react-draggable';
//facebook-login

import { AppContext } from '../context/AppContext';

//import helper
import manicureUserData from '../helpers/manicureUserData';


export default function NuLogin(props) {

  const {login, setLogin, setUserData} = useContext(AppContext);

  const [inputs, setInputs] = useState({email: "", password: ""});
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