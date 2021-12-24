import React, { useContext, useEffect, useState, Fragment } from 'react';
import './styles/Login.css';
import { Link } from 'react-router-dom';
import Register from './Register';
import UserFinder from '../apis/UserFinder.js';
//facebook-login

import { AppContext } from '../context/AppContext';

//import helper
import manicureUserData from '../helpers/manicureUserData';


export default function Login() {

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

      if (response.jwtToken) {
        localStorage.setItem("token", response.jwtToken);
        setLogin(true);
        // toast.success("Logged in Successfully");
      } else {
        setLogin(false);
        // toast.error(response);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const show_Login = () => {
    setShowLogin(!showLogin);
  }


    //check if fb login is already stored in local storage...
//   function prepareUserData() {
//     console.log('getting userdata: ');
//     const prepareIt = async () => {
//       try{
//         const userDataLS = (JSON.parse(window.localStorage.getItem('userData'))) || false;
//         console.log('userdata: ', userDataLS);

//         //there shouldnt exist a situation in which a user is logged in and they dont exist in the db...
//         //but this is just to be safe
//         if(userDataLS) {
//           console.log('inside userdatals');
//           //set state to match local storage... 
//           const user = await UserFinder.get(`/get-user/${userDataLS.user_id}`);
//           console.log("this is user after get", user);


//           const manicuredUser = manicureUserData(user.data.user)
//           setUserData(manicuredUser);
//           // setUserData(user.data.user[0])
//           setLogin(true);
//           setUserLocalStorage(manicuredUser);
//         }
//       } catch(err) {
//         console.log("error preparing userdata", err);
//       }
//     }

//     prepareIt();

//   }


//   const responseFacebook = (response) => {
//     //monitoring
//     console.log("in fb login response");
//     console.log("userd in response fb", userData);
    
//     console.log("this is the facebook login response: ", response);
//     if (response.accessToken) {
//       console.log("identifying response access token?");

//       //send request with this body
//       const payload = {
//         fbid: response.id,
//         name: response.name,
//         picture: response.picture.data.url,
//         email: response.email,
//       }

//       const addUser = async (payload) => {
//         try {
//           const user = await UserFinder.post('/save-user', payload);
//           console.log("userdata in adduser", userData);
//           const manicuredUser = manicureUserData(user.data.user)
//           setUserData(manicuredUser);
//           // setUserData(user.data.user[0])
//           setLogin(true);
//           setUserLocalStorage(manicuredUser);
//           // setUserLocalStorage(payload);
//           console.log("adding a user worked!. Here's response: ", user);
//         } catch(err) {
//           console.log("Error saving user: ", err);
//         }
        
//       }

//       addUser(payload);

//     } else {
//       setLogin(false);
//     }
    
//   };


//     useEffect(prepareUserData, []);

    return(
        <div id="outer-login-div">
            {showLogin ?
            <Fragment>
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
            <a href="#" onClick={show_Login}>login</a>
            </Fragment>
            : <Register showLogin={showLogin} setShowLogin={setShowLogin} /> }
        </div>
    );
}