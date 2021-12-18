import React, { useContext, useEffect } from 'react';
import './styles/ItemPost.css';
import Likes from './Likes';
import CommentBox from './CommentBox';
import { Link } from 'react-router-dom';

let FILE_ROOT = '/client/public';
if(process.env.NODE_ENV === 'production') {
  FILE_ROOT = '/client/build';
} 



export default function ItemPost(props) {
    // props
    const item = props.item;

    let creatorFirstName = item.name.split(" ")[0];

    const filename = item.filepath.substring(FILE_ROOT.length);
    console.log(item);

    return(
        <div id={item.item_id} className="item-post-container">
            <div className="item-title-div">
                <Link to={{pathname: `/item/${item.item_id}`, state: JSON.stringify(item)}}>
                    {/* 12-14-21 temporary... this should be item name @ place name */}
                    <h1 className="itempost-h1">{item.item_name} @ {item.place_name}</h1>
                </Link>
            </div>
            
            <div className="item-image-div"><img alt={item.name} className="item-image" src={filename} /></div>
            <Likes sock={props.sock} item={item} />
            <CommentBox dataRef={props.dataRef} sock={props.sock} itemID={item.item_id} />
            <div className="itempost-user-img-name-div">
                <p className="itempost-username-p">added by</p>
                <img className="itempost-fb-img" src={item.picture} alt="facebook pic" />
                <Link to={{pathname: `/user/${item.facebook_id}`}}><p className="itempost-username-p"> {creatorFirstName} </p></Link>
            </div>
        </div>
    );
}