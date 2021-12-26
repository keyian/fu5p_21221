import React, {useState, Fragment} from 'react';
import Image from 'react-bootstrap/Image';
import CommentBox from './CommentBox';
import Likes from './Likes';
import Modal from 'react-bootstrap/Modal';
export default function ItemRow(props) {
    // props
    const item = props.item;
    console.log("item", item);
    const [modalShow, setModalShow] = useState(false);
    let FILE_ROOT = '/client/public';

    if(process.env.NODE_ENV === 'production') {
        FILE_ROOT = '/client/build';
    } 

    const handleClick = (e) => {
        e.preventDefault();
        setModalShow(true);
    }

    const handleClose = () => {
        setModalShow(false);
    }

    return(
        <Fragment>

            <tr onClick={handleClick}>
                <th className="col-md-2"><Image thumbnail src={item.filepath.substring(FILE_ROOT.length)} /></th>
                <td>{item.item_name}</td>
                <td>{item.price}</td>
                <td>{item.place_name}</td>
                <td><Likes item={item} socket={props.socket} /></td>
            </tr>
            
            <Modal show={modalShow} onHide={handleClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{item.item_name} @ {item.place_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image width={"100%"} src={item.filepath.substring(FILE_ROOT.length)} />
                    <Likes item={item} socket={props.socket} />
                    <CommentBox dataRef={props.key} itemID={item.item_id} socket={props.socket} />
                </Modal.Body>
            </Modal>

        </Fragment>
    );
}