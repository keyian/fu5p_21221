import React, {useState, Fragment, useContext} from 'react';
import Image from 'react-bootstrap/Image';
import CommentBox from './CommentBox';
import Likes from './Likes';
import Modal from 'react-bootstrap/Modal';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import EditItemButtons from './EditItemButtons';

export default function ItemRow({del, item, edit, like, ...props}) {
    const {userData, fileRoot} =  useContext(AppContext);
    // props
    const [modalShow, setModalShow] = useState(false);

    console.log('item in likes', item);

    //if there's no item.name, that means it was live-added, so it has to be the current user...
    let creatorFirstName = item.name? item.name.split(" ")[0] : userData.name.split(" ")[0];


    const handleClick = (e) => {
        e.preventDefault();
        setModalShow(true);
    }

    const handleClose = () => {
        setModalShow(false);
    }

    // const handleItemEdit = (nuItem) => {
    //     console.log("this is nuItem", Object.assign({...item}, nuItem.data.item[0]));
    //     //set item to item with updated fields
    //     setItem(Object.assign({...item}, nuItem.data.item[0]));
    //     // setModalShow(false);
    // }

   

    return(
        <Fragment>

            <tr id={item.item_id} onClick={handleClick}>
                <th className="col-md-2"><Image thumbnail src={item.filepath.substring(fileRoot.length)} /></th>
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
                    <Image className="itemfeed-image" src={item.s3_url} />
                    <Likes item={item} like={like} socket={props.socket} />
                    <CommentBox dataRef={props.dataRef} itemID={item.item_id} socket={props.socket} />
                    <EditItemButtons userData={userData} item={item} edit={edit} del={del}/>
                    <p className="itempost-username-p">added by</p>
                    <Link to={{pathname: `/user/${item.creator_id}`}}><p className="itempost-username-p"> {creatorFirstName} </p></Link>
                </Modal.Body>
            </Modal>

        </Fragment>
    );
}