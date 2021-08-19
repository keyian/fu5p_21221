import React, { Component } from 'react';

import './styles/ItemFeed.css';

import ItemPost from './ItemPost';

export default function ItemFeed(props) {
    let items = props.items;
    return(
        items.map(
            (item, i) => <ItemPost key={i} item={item} user={props.user} login={props.login} />
        )
    );
}