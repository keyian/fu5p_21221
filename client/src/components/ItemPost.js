import React, { Component } from 'react';
import './styles/ItemPost.css';
import LikeHeart from './LikeHeart';
//const FILE_ROOT = '/client/public';

export default function ItemPost(props) {
    let item = props.item;
    let place = item.place;
    //let filename = item.img.substring(FILE_ROOT.length);
    let filename = item.img;
    console.log("thisis item prop in itempost", item);
    console.log(filename);

    return(
        <div id={item._id} className="item-post">
            <h1>{item.name} @ {place.name}</h1>
            <img className="item-image" src={filename} />
            <LikeHeart item={item} user={props.user} login={props.login}/>
        </div>
    );
}