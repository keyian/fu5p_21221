import React, {useState, useContext} from 'react';
import Button from './Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import { AppContext } from '../context/AppContext';
import ItemFinder from '../apis/ItemFinder';

const EditItemModal = (props) => {
    const {fileRoot} = useContext(AppContext);
    const {item, show, setShow} = props;

    const [inputs, setInputs] = useState({
            item_name: item.item_name,
            price: item.price,
            description: item.description
    });

    const handleClose = (e) => {
        setShow(false);
    }

    const onChange = e =>
        setInputs({ ...inputs, [e.target.name]: e.target.value });

    const {item_name, price, description} = inputs;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuItem = await ItemFinder.put(`/edit-item/${item.item_id}`, inputs);
        props.edit(nuItem);
        setShow(false);
    } 

    return(
        <Modal show={show} onHide={handleClose} animation={true}>
            <Modal.Header closeButton>
                    <Modal.Title>
                        {item.item_name}
                    </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Image width="100%" src={item.s3_url} />
                    <input type="text" name="item_name" value={item_name || ''} onChange={onChange} placeholder={item_name}/>
                    <div id="price-input-div">
                        <span id="dollar-span">$</span>
                        <input type="text" id="price-input" name="price" value={price} onChange={onChange} placeholder={price} />
                    </div>
                    <textarea rows="4" cols="30" name="description" value={description} onChange={onChange} placeholder={description}/>
                    <Button>Update {item.item_name}</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditItemModal;