import React from 'react';

import './styles/ItemFeed.css';

import ItemPost from './ItemPost';

export default function ItemFeed(props) {
    let items = props.items;

    //live commenting websocket
    const sock = new WebSocket('ws://localhost:8080/comment');
    sock.onopen = function() {
        console.log('open');
    };
    

    return(
        items.map(
            (item, i) => <ItemPost key={i} sock={sock} item={item} user={props.user} login={props.login} />
        )
    );
}