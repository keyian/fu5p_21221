import React, { useState, useContext } from "react";
import { AppContext } from '../context/AppContext';
import Form from 'react-bootstrap/Form'


// import { toast } from "react-toastify";
import UserFinder from '../apis/UserFinder.js';
import manicureUserData from "../helpers/manicureUserData";
import Container from 'react-bootstrap/Container';

const Register = (props) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });

  const {setLogin, setUserData} = useContext(AppContext);


  const { email, password, name } = inputs;


  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const credentials = { email, password, name };
      const response = await UserFinder.post("/authentication/register",credentials);

      console.log("this is credentials ", credentials);
      console.log("this is response", response);
      if (response.data.jwtToken) {
        localStorage.setItem("token", response.data.jwtToken);
        const manicuredUser = manicureUserData([response.data.user]);
        setUserData(manicuredUser);
        localStorage.setItem("userData", manicuredUser);
        setLogin(true);
        // toast.success("Register Successfully");
      } else {
        setLogin(false);
        // toast.error(parseRes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
      <Container>
        <h3>Register</h3>
        <Form onSubmit={onSubmitForm}>
          <Form.Control
              type="text"
              name="name"
              value={name}
              placeholder="name"
              onChange={e => onChange(e)}
              className="form-control my-3"
            />
            <Form.Control
              type="text"
              name="email"
              value={email}
              placeholder="email"
              onChange={e => onChange(e)}
              className="form-control my-3"
            />
            <Form.Control
              type="password"
              name="password"
              value={password}
              placeholder="password"
              onChange={e => onChange(e)}
              className="form-control my-3"
            />
          <button className="btn btn-success btn-block">Submit</button>
        </Form>
      </Container>
  );
};

export default Register;