import React, { useEffect } from 'react';
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




export default function NuItemFeed({del, items, edit, like, ...props}) {
    useEffect(() => {


        return function cleanup() {
            // socket.disconnect();
        }
    })
    //"dataRef" is used to record Index, because "key" is inaccessible in Child
    return(
            <Table striped hover className="col-md-4">
                <thead>
                    <tr>
                        <th className='black-white-75-stroke'>Things</th>
                    </tr>
                </thead>
                <div id="feed-container">
                    <tbody>
                    {items.map(
                        (item, i) => <ItemRow click={props.click} del={del} edit={edit} like={like} key={item.item_id} dataRef={item.item_id} item={item} socket={socket} />
                    )}
                    </tbody>
                </div>
                
            </Table>

    );
}