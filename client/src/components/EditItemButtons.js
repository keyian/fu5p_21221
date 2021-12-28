import React, { Fragment, useState } from 'react';
import Button from './Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './../App.css';
import EditItemModal from './EditItemModal';
import DeleteButton from './DeleteButton';

const EditItemButtons = ({edit, del, ...props}) => {
    const {item} = props;
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const handleEdit = () => {
        // e.preventDefault();
        console.log("this is handle edit");

        setEditShow(!editShow);
    }

    return(
        
        <Fragment>
            <ButtonGroup>
                <Button onClick={handleEdit}>Edit</Button>
                <DeleteButton del={del} item={item} />
            </ButtonGroup>
            <EditItemModal item={item} edit={edit} show={editShow} setShow={setEditShow} />
        </Fragment>
    );
    
}

export default EditItemButtons;