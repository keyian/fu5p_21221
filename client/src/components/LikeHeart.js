import React, { useState } from 'react';
import axios from 'axios';
import './styles/LikeHeart.css';


export default function LikeHeart(props) {
    //helper variables
    const [user, setUser] = useState(props.user);
    let login = props.login;
    const [item, setItem] = useState(props.item);
    console.log("his is likeheart item", item);
    const [liked, setLiked] = useState(isItemLiked());
    
    
    function isItemLiked() {
        return login ? user.favorites.includes(item._id) : false;
    }

    function handleLikeClick(e) {
        console.log("this is login", login);
        if(login) {
            console.log("this is handleLike click")
            console.log("this is user.favorites.includes(''+item._id)", user.favorites.includes(""+item._id))
            setLiked(user.favorites.includes(""+item._id));
        }

        let body = {userID: user._id, itemID: item._id, liked: liked}
        
        axios.post('/api/favorite-click', body)
        .then((res)=>{
                let {item, user} = res.data;
                console.log(user);
                //update everything
                 window.localStorage.setItem('userData', JSON.stringify(user));
                 setUser(user);
                 setItem(item);
                 setLiked(!liked);
            })
        .catch((error)=>console.log("error in favorite-click: ", error));
    }

    return(
        <div>
            <div className="notFilled" onClick={handleLikeClick}>&hearts;</div>
            <p>Favorites: {item.favorites}</p>
        </div>
    );
}