import React from 'react';
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
    let item = props.item;
    let place = item.place;
    let user = props.user;
    let userFirstName = user.name.split(" ")[0];
    let filename = item.img.substring(FILE_ROOT.length);
    //item state object to pass through link
    let itemStateObject = {
        itemName: item.name,
        itemImgFilename: filename,
        itemPlaceName: place.name,


    };
    
   
    console.log("thisis item prop in itempost", item);
    console.log(filename);
    

    return(
        <div id={item._id} className="item-post-container">
            <div className="item-title-div"><Link to={{pathname: `/item/${item._id}`, state: JSON.stringify(item)}}><h1 className="itempost-h1">{item.name} @ {place.name}</h1></Link></div>
            
            <div className="item-image-div"><img alt={item.name} className="item-image" src={filename} /></div>
            <Likes sock={props.sock} item={item} user={user} login={props.login}/>
            <CommentBox dataRef={props.dataRef} sock={props.sock} itemID={item._id} user={user} login={props.login} />
            <div className="itempost-user-img-name-div">
                <p className="itempost-username-p">added by</p>
                <img className="itempost-fb-img" src={user.picture} alt="facebook pic" />
                <Link to={{pathname: `/user/${user._id}`}}><p className="itempost-username-p"> {userFirstName} </p></Link>
            </div>
        </div>
    );
}