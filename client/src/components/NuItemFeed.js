import React from 'react';
import './styles/NuItemFeed.css';
import ItemRow from './ItemRow';
//socket
import { io } from "socket.io-client";
import Table from 'react-bootstrap/Table';
const SERVER = "https://localhost:3000";
const socket = io(SERVER, {
    withCredentials: true
  });;

socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);
});



export default function NuItemFeed({del, items, edit, like}) {
    
    //"dataRef" is used to record Index, because "key" is inaccessible in Child
    return(
        // <div id="itemfeed-div">
        //     {items.map(
        //         (item, i) => <ItemPost key={item.item_id} dataRef={i} item={item} socket={socket} />
        //     )}
        // </div>
            <Table striped  hover className="col-md-1 feed-container" size="sm">
                <thead>
                    <tr>
                        <th></th>
                        <th>Item</th>
                        <th>Price</th>
                        <th>@</th>
                        <th>Likes</th>
                    </tr>
                </thead>
                <tbody>
                {items.map(
                    (item, i) => <ItemRow del={del} edit={edit} like={like} key={item.item_id} dataRef={item.item_id} item={item} socket={socket} />
                )}
                </tbody>
            </Table>

            // <ListGroup xs={3} md={3} lg={3}>
            //   {items.map(
            //         (item, i) => 
            //             <NuListRow key={item.item_id} item={item} socket={socket} />
                    
            //     )}
            // </ListGroup>
    );
}