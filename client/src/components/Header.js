import React from 'react';
// import Login from './Login.js';
import {Link} from 'react-router-dom';
import LoginBox from './LoginBox.js';

//react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Motion, spring, presets } from "react-motion";


export default function Header() {

    return (

        <Motion
            defaultStyle={{
                opacity: 0,
                translateY: 30
            }}
            style={{
                opacity: spring(1),
                translateY: spring(0, presets.wobbly)
            }}
        >
            {interpolatedStyles => (
                <Container style={{
                    transform: `translateY(${interpolatedStyles.translateY}px)`,
                    opacity: interpolatedStyles.opacity}}>
                    <Row id="header-row">
                        <Col>
                            <Link to={'/'} replace><h2 className="under5-title">things we like</h2></Link>    
                        </Col>
                        <Col md={3}className="my-auto">
                            <LoginBox />
                        </Col>
                    </Row>  
                </Container>
            )}
        </Motion>
        
            
    );
}