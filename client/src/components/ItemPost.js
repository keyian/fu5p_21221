import React from 'react';
import './styles/ItemPost.css';
import LikeHeart from './LikeHeart';
let FILE_ROOT = '/client/public';
if(process.env.NODE_ENV === 'production') {
  FILE_ROOT = '/client/build';
} 

export default function ItemPost(props) {
    // props
    let item = props.item;
    let place = item.place;
    let user = props.user;
    
    let filename = item.img.substring(FILE_ROOT.length);
    console.log("thisis item prop in itempost", item);
    console.log(filename);

    return(
        <div id={item._id} className="item-post">
            <h1>{item.name} @ {place.name}</h1>
            <div>
                <img src={user.picture} alt="facebook pic" />
                <p> {user.name} </p>
            </div>
            <img alt={item.name} className="item-image" src={filename} />
            <LikeHeart item={item} user={user} login={props.login}/>
        </div>
    );
}