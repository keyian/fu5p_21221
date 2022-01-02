import React, { useContext, useState, Fragment } from 'react';
import './styles/LoginBox.css';
import { Link } from 'react-router-dom';
import Register from './Register';
import NuLogin from './NuLogin';

import Button from './Button';
//facebook-login

import { AppContext } from '../context/AppContext';

export default function LoginBox() {

  const {login, setLogin, userData, setUserData} = useContext(AppContext);

  const [showLogin, setShowLogin] = useState(false);    

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
                    <Button onClick={show_Login}>login</Button>
                </Fragment>
              : 
                <Fragment>
                    <NuLogin/>
                    <Button className="no-dec-button" onClick={show_Login}>register</Button>
                </Fragment>
            }
          </Fragment>
        }
      </div>
    );
}

