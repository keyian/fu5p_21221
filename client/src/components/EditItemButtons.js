import React, { Fragment, useState } from 'react';
import Button from './Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './../App.css';
import EditItemModal from './EditItemModal';
import DeleteButton from './DeleteButton';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';

const EditItemButtons = ({edit, del, userData, item, ...props}) => {
    const [editShow, setEditShow] = useState(false);
    const handleEdit = () => {
        // e.preventDefault();
        console.log("this is handle edit");

        setEditShow(!editShow);
    }
    return(
        <Fragment>
        { ((userData.user_id === item.creator_id) || (userData.admin)) ?
        <Container>
                <Col>
                    <Button className="fu5p-button" onClick={handleEdit}>Edit</Button>
                </Col>
                <Col>
                    <DeleteButton className="fu5p-button" del={del} item={item} />
                </Col>
            <EditItemModal item={item} edit={edit} show={editShow} setShow={setEditShow} />
        </Container>
        :
        <Fragment>
            
        </Fragment>
        }
        </Fragment>
    );
    
}

export default EditItemButtons;