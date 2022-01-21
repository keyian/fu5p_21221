import React from 'react';
import ItemRow from './ItemRow';
//socket
import { io } from "socket.io-client";
import Table from 'react-bootstrap/Table';
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


socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);
});



export default function NuItemFeed({del, items, edit, like}) {
    
    //"dataRef" is used to record Index, because "key" is inaccessible in Child
    return(
            <Table striped  hover className="col-md-4 feed-container" size="sm">
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

    );
}