import React from 'react';
import './styles/ItemFeed.css';
import ItemRow from './ItemRow';
//socket
import { io } from "socket.io-client";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import ItemPost from './ItemPost';
const SERVER = "https://localhost:3000";
const socket = io(SERVER, {
    withCredentials: true
  });;

socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);
});

let FILE_ROOT = '/client/public';
if(process.env.NODE_ENV === 'production') {
  FILE_ROOT = '/client/build';
} 


export default function ItemFeed(props) {
    let items = props.items;
    

    
    //"dataRef" is used to record Index, because "key" is inaccessible in Child
    return(
        <div id="itemfeed-div">
            {items.map(
                (item, i) => <ItemPost key={i} dataRef={i} item={item} socket={socket} />
            )}
        </div>
            // <Table striped  hover size="sm">
            //     <thead>
            //         <tr>
            //             <th> #</th>
            //             <th>Item</th>
            //             <th>Price</th>
            //             <th>@</th>
            //             <th>Likes</th>
            //         </tr>
            //     </thead>
            //     <tbody>
            //     {items.map(
            //         (item, i) => <ItemRow key={i} dataRef={i} item={item} socket={socket} />
            //     )}
            //     </tbody>
            // </Table>

            // <ListGroup xs={3} md={3} lg={3}>
            //   {items.map(
            //         (item, i) => <ListGroup.Item>
            //             <Image src={item.filepath.substring(FILE_ROOT.length)} rounded thumbnail width="100px"/>
            //         </ListGroup.Item> 
            //     )}
            // </ListGroup>
    );
}