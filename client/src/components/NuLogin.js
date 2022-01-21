import React, { useContext, useState } from 'react';
import UserFinder from '../apis/UserFinder.js';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'

//facebook-login

import { AppContext } from '../context/AppContext';

//import helper
import manicureUserData from '../helpers/manicureUserData';


export default function NuLogin(props) {

  const {setLogin, setUserData} = useContext(AppContext);

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

  return(

      <Container>
          <h3>Login</h3>
          <Form onSubmit={onSubmitForm}>
              <Form.Control
                type="text"
                name="email"
                value={email}
                onChange={e => onChange(e)}
                className="form-control my-3"
                placeholder="email"
                />
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={e => onChange(e)}
              className="form-control my-3"
              placeholder="password"
              />
              
              <button className="btn btn-success btn-block">Submit</button>
          </Form>
        </Container>
        
  );
}