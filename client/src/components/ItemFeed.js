import React from 'react';
import './styles/ItemFeed.css';
import ItemPost from './ItemPost';
//socket
import { io } from "socket.io-client";
const SERVER = "https://localhost:3000";
const socket = io(SERVER, {
    withCredentials: true
  });;

socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);
});



export default function ItemFeed(props) {
    let items = props.items;
    

    
    //"dataRef" is used to record Index, because "key" is inaccessible in Child
    return(
        <div id="itemfeed-div">
            {items.map(
                (item, i) => <ItemPost key={i} dataRef={i} item={item} socket={socket} />
            )}
        </div>
    );
}