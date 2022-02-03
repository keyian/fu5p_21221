import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from "react-router-dom";
import ItemFinder from '../apis/ItemFinder';
import { AppContext } from '../context/AppContext';

//components
import ItemMap from './ItemMap';
import EditItemButtons from './EditItemButtons';
import CommentBox from './CommentBox';
import { Link } from 'react-router-dom';

//react-bootstrap
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

//comment socket
import { io } from "socket.io-client";
const SERVER = "https://localhost:3000";
var socket;
if(process.env.NODE_ENV === "production") {
    socket = io({
        withCredentials: true
      });;
} else {
    socket = io(SERVER, {
        withCredentials: true
      });;
}

export default function Item(props) {
    //check for location state (means Item page clicked through Link)
    //no location state means person was linked, we need to request Item with populated comments
    const {userData} = useContext(AppContext);
    const location = useLocation();

    const [item, setItem] = useState({});
    console.log("userdata?", userData);

    const requestItem = () => {
        console.log("are we in useeffect?");
        

        const runRequestItem = async () => {
            console.log("In use effect request item");
            try {
                let splitPath = location.pathname.split('/');
                let itemID = splitPath[splitPath.length-1];
                let itemResults = await ItemFinder.get(`/get-one-item/${itemID}`)
                setItem(itemResults.data.results);
                console.log(itemResults)
            } catch(err) {
                console.log('Error retrieving getItems data!**: ', err);
            }
        };

        runRequestItem();
    }

    
    useEffect(requestItem, [location, userData]);

    console.log("this is item in item", item);


    const handleItemEdit = (nuItem) => {
        console.log("handle item edit??", nuItem);
        setItem(Object.assign({...item}, nuItem.data.item[0]));
        console.log("item in handleitem edit", item);
    }

    return (item.item_name) ? (
        
        <div>
            <Container>
                <Row>
                    <EditItemButtons edit={handleItemEdit}  userData={userData} item={item} />
                </Row>
                <Row>
                    <Col md={6}>
                        <h3 className="black-white-125-stroke">{item.item_name} @ {item.place_name}</h3>
                        <Image className="non-map-img" src={item.s3_url} />
                    </Col>
                    <Col md={4} className="my-auto">
                        <ItemMap id="item-pg-map" items={[item]} />
                    </Col>
                </Row>
                <Row>
                    <CommentBox itemID={item.item_id} socket={socket} />
                </Row>

                
                <h4>added by <Link to={{pathname: `/user/${item.creator_id}`}}>{item.name.split(" ")[0]}</Link></h4>
                
            </Container>
            
        </div>
    ) : (<p>Item Page</p>);
}