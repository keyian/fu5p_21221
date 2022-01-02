import React from 'react';
//socket
import { io } from "socket.io-client";
import ItemPost from './ItemPost';
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
                (item, i) => <ItemPost key={item.item_id} dataRef={i} item={item} socket={socket} />
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