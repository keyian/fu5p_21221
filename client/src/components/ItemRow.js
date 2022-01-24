import React, {useState, Fragment, useContext} from 'react';
import CommentBox from './CommentBox';
import Likes from './Likes';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import EditItemButtons from './EditItemButtons';

//react-bootstrap
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function ItemRow({del, item, edit, like, ...props}) {
    const {userData} =  useContext(AppContext);
    // props
    const [modalShow, setModalShow] = useState(false);

    //if there's no item.name, that means it was live-added, so it has to be the current user...
    let creatorFirstName = item.name? item.name.split(" ")[0] : userData.name.split(" ")[0];

    const handleClick = (e) => {
        e.preventDefault();
        props.click(item.coordinates);
        setModalShow(true);
    }

    const handleClose = () => {
        setModalShow(false);
    }

    return(
        <Fragment>
                <tr id={item.item_id} onClick={handleClick}>
                    <td><Image className="itemrow-img non-map-img" src={item.s3_url} /></td>
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
                    <Container>
                        <Row>
                            <Image className="itemfeed-image" src={item.s3_url} />
                        </Row>
                        <Row>
                            <Col><Likes item={item} like={like} /></Col>
                            <Col><CommentBox dataRef={props.dataRef} itemID={item.item_id} socket={props.socket} /></Col>
                        </Row>
                        
                        <Row>
                            <EditItemButtons userData={userData} item={item} edit={edit} del={del}/>
                            <p className="itempost-username-p">added by</p>
                            <Link to={{pathname: `/user/${item.creator_id}`}}><p className="itempost-username-p"> {creatorFirstName} </p></Link>
                        </Row>
                    </Container>
                    
                </Modal.Body>
            </Modal>

        </Fragment>
    );
}