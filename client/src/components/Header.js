import React from 'react';
// import Login from './Login.js';
import {Link} from 'react-router-dom';
import LoginBox from './LoginBox.js';

//react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Header() {

    return (
        <Container>
            <Row id="header-row">
                <Col>
                    <Link to={'/'} replace><h2 className="under5-title">Under 5</h2></Link>    
                </Col>
                <Col>
                    <LoginBox />
                </Col>
            </Row>  
        </Container>
            
    );
}