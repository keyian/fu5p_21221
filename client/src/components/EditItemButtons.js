import React, { Fragment, useState } from 'react';
import Button from './Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './../App.css';
import EditItemModal from './EditItemModal';

const EditItemButtons = (props) => {
    const {item, setItem} = props;
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const handleEdit = () => {
        // e.preventDefault();
        console.log("this is handle edit");

        setEditShow(!editShow);
    }
    const handleDelete = (e) => {
        e.preventDefault();
    }
    return(
        <Fragment>
            <ButtonGroup>
                <Button onClick={handleEdit}>Edit</Button>
                <Button onClick={handleDelete}>Delete</Button>
            </ButtonGroup>
            <EditItemModal item={item} handleItemEdit={props.editItemCallback} show={editShow} setShow={setEditShow} />
        </Fragment>
    );
    
}

export default EditItemButtons;