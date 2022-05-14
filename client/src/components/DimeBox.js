import React from 'react';

//react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import DimeButton from './DimeButton';

export default function DimeBox() {



  return(
      <Container id="outer-login-div">
          <Row>
              <DimeButton />
          </Row>
      </Container>
    );
}

