import React from 'react';

import './styles/ItemFeed.css';

import ItemPost from './ItemPost';

// live commenting websocket
const sock = new WebSocket('ws://localhost:8080/');
sock.onopen = function() {
    console.log('open');
};



export default function ItemFeed(props) {
    let items = props.items;

    
    //"dataRef" is used to record Index, because "key" is inaccessible in Child
    return(
        <div id="itemfeed-div">
            {items.map(
                (item, i) => <ItemPost key={i} dataRef={i} sock={sock} item={item} user={props.user} login={props.login} />
            )}
        </div>
    );
}