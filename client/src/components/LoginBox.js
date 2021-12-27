import React, { useContext, useEffect, useState, Fragment } from 'react';
import './styles/Login.css';
import { Link } from 'react-router-dom';
import Register from './Register';
import NuLogin from './NuLogin';
import Modal from 'react-bootstrap/Modal';
//facebook-login

import { AppContext } from '../context/AppContext';

//import helper
import manicureUserData from '../helpers/manicureUserData';


export default function LoginBox() {

  const {login, setLogin, userData, setUserData} = useContext(AppContext);

  const [showLogin, setShowLogin] = useState(false);    
  const [modalShow, setModalShow] = useState(false);


  const show_Login = () => {
    console.log("show log in getting called");
    setShowLogin(!showLogin);

  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setUserData({});
      setLogin(false);
    } catch (err) {
      console.log("Error logging out", err);
    }
  };

  return(
      <div id="outer-login-div">
        {login ? 
          <Fragment>
            <p>Welcome, 
              <Link to={{pathname: `/user/${userData.user_id}`}} >{userData.name}</Link>
            </p>
            <button onClick={e => logout(e)} className="btn btn-primary">
              Logout
            </button>
          </Fragment>
        :
          <Fragment>
            {showLogin ?
                <Fragment>
                    <Register /> 
                    <a href="#" onClick={show_Login}>login</a>
                </Fragment>
              : 
                <Fragment>
                    <NuLogin/>
                    <a href="#" onClick={show_Login}>register</a>
                </Fragment>
            }
          </Fragment>
        }
      </div>
    );
}

