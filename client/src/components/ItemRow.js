import React, {useState, Fragment, useContext} from 'react';
import Image from 'react-bootstrap/Image';
import CommentBox from './CommentBox';
import Likes from './Likes';
import Modal from 'react-bootstrap/Modal';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function ItemRow(props) {
    const {userData} = useContext(AppContext);
    // props
    const item = props.item;
    console.log("item", item);
    const [modalShow, setModalShow] = useState(false);
    let FILE_ROOT = '/client/public';


    if(process.env.NODE_ENV === 'production') {
        FILE_ROOT = '/client/build';
    } 
    //if there's no item.name, that means it was live-added, so it has to be the current user...
    let creatorFirstName = item.name? item.name.split(" ")[0] : userData.name.split(" ")[0];


    const handleClick = (e) => {
        e.preventDefault();
        setModalShow(true);
    }

    const handleClose = () => {
        setModalShow(false);
    }

    return(
        <Fragment>

            <tr id={item.item_id} onClick={handleClick}>
                <th className="col-md-2"><Image thumbnail src={item.filepath.substring(FILE_ROOT.length)} /></th>
                <td>{item.item_name}</td>
                <td>{item.price}</td>
                <td>{item.place_name}</td>
                <td>{item.likes} likes</td>
            </tr>
            
            <Modal show={modalShow} onHide={handleClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title><Link to={{pathname: `/item/${item.item_id}`}}>{item.item_name} @ {item.place_name}</Link></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image width={"100%"} src={item.filepath.substring(FILE_ROOT.length)} />
                    <Likes item={item} socket={props.socket} />
                    <CommentBox dataRef={props.key} itemID={item.item_id} socket={props.socket} />
                    <p className="itempost-username-p">added by</p>
                    <Link to={{pathname: `/user/${item.creator_id}`}}><p className="itempost-username-p"> {creatorFirstName} </p></Link>
                </Modal.Body>
            </Modal>

        </Fragment>
    );
}