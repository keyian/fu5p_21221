import React, { useContext, useState } from 'react';
import './styles/LoginBox.css';
import '../App.css';
import { Link } from 'react-router-dom';
import Register from './Register';
import NuLogin from './NuLogin';
//react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
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
      <Container id="outer-login-div">
        {login ? 
          <Row>
            <p>Welcome, 
              <Link to={{pathname: `/user/${userData.user_id}`}} >{userData.name}</Link>
            </p>
            <button onClick={e => logout(e)} className="btn btn-primary">
              Logout
            </button>
          </Row>
        :
          <Row>
            {showLogin ?
                <Container>
                  <Row>
                    <Register /> 
                  </Row>
                  <Row>
                    <Button className="no-dec-button" onClick={show_Login}>login</Button> 
                  </Row>
                </Container>
              : 
                <Container>
                  <Row>
                    <NuLogin/>
                  </Row>
                  <Row>
                    <Button className="no-dec-button" onClick={show_Login}>register</Button>
                  </Row>
                </Container>
            }
          </Row>
        }
      </Container>
    );
}

