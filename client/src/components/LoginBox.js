import React, { useContext, useState, useEffect } from 'react';
import './styles/LoginBox.css';
import '../App.css';
import { Link } from 'react-router-dom';
import Register from './Register';
import NuLogin from './NuLogin';
//react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from './Button';

//helpers
import manicureUserData from '../helpers/manicureUserData';

//axios
import UserFinder from '../apis/UserFinder';


import { AppContext } from '../context/AppContext';

export default function LoginBox() {

  const {login, setLogin, userData, setUserData} = useContext(AppContext);

  const [showLogin, setShowLogin] = useState(false);    
  const [showRegister, setShowRegister] = useState(false);    


  const show_Login = () => {
    console.log("show log in getting called");
    setShowLogin(!showLogin);
    setShowRegister(false);

  }

  const show_Register = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
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

  useEffect(getUserData, [login]);


  return(
      <Container id="outer-login-div">
        {login ? 
          <Row>
            <p className="black-white-75-stroke">Welcome,&nbsp;
              <Link to={{pathname: `/user/${userData.user_id}`}} >
                <span className="blue-white-75-stroke">{userData.name}</span>
              </Link>
            </p>
            <button onClick={e => logout(e)} className="btn btn-primary fu5p-button">
              Logout
            </button>
          </Row>
        :
          <Row>
            {(showRegister) &&
                <Container>
                  <Row>
                    <Register /> 
                  </Row>
                  <Row>
                    <Button className="no-dec-button" onClick={show_Login}>login</Button> 
                  </Row>
                </Container>
          }{showLogin &&

                <Container>
                  <Row>
                    <NuLogin/>
                  </Row>
                  <Row>
                    <Button className="no-dec-button" onClick={show_Register}>register</Button>
                  </Row>
                </Container>
          }{!showLogin && !showRegister && 
              <Container>
                <Row>
                  <Button className="no-dec-button login-btns blue-white-75-stroke" onClick={show_Login}>login</Button> 
                  <Button className="no-dec-button login-btns blue-white-75-stroke" onClick={show_Register}>register</Button>
                </Row>
              </Container>
            }
          </Row>
        }
      </Container>
    );
}

