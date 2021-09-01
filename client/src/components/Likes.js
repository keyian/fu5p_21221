import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Likes.css';


export default function Likes(props) {
    //helper variables
    const [user, setUser] = useState(props.user);
    let login = props.login;
    const [item, setItem] = useState(props.item);
    console.log("his is likes' item", item);
    const [liked, setLiked] = useState(isItemLiked());
    const [disliked, setDisliked] = useState(isItemDisliked());
    
    
    function isItemLiked() {
        return login ? user.liked.includes(item._id) : false;
    }

    function isItemDisliked() {
        return login ? user.disliked.includes(item._id) : false;
    }

    function handleClick(action) {
        //preserve so db knows what to do 
        let oldLiked = liked;
        let oldDisliked = disliked;
        let nuLiked = false;
        let nuDisliked = false;
        console.log(liked, disliked);
        console.log(action);
        if(action == "like") {
            console.log('in like acion');
            if(oldLiked) {
                setLiked(false);
                nuLiked = false;
                console.log(liked);
            } else {
                setLiked(true);
                nuLiked = true;
                setDisliked(false);
                nuDisliked = false;
                console.log("was not liked,", liked, disliked)
            }
        } else {
            if(oldDisliked) {
                setDisliked(false);
                nuDisliked = false;
            } else {
                setDisliked(true);
                nuDisliked = true;
                setLiked(false);
                nuLiked = false;
            }
        }

        let body = {userID: user._id, itemID: item._id, liked: nuLiked, disliked: nuDisliked, oldLiked: oldLiked, oldDisliked: oldDisliked}
        
        axios.post('/api/like-click', body)
        .then((res)=>{
                let {item, user} = res.data;
                console.log(user);
                //update everything
                 window.localStorage.setItem('userData', JSON.stringify(user));
                 setUser(user);
                 setItem(item);
            })
        .catch((error)=>console.log("error in favorite-click: ", error));
    }

    // useEffect(()=>{console.log("useEffect",liked, disliked);}, [liked, disliked])

    return(
        <div>
            {/* two divs, one thumbs up, one thumbs down */}
            {(login)?
                <div>
                    <div className="notFilled" onClick={()=>handleClick("like")}>&hearts;</div>
                    <div className="filled" onClick={()=>handleClick("dislike")}>anything</div>
                </div>
                :
                <p id="login-to-like-p"> login to like and dislike items! </p>
            }
            

            <p>Likes: {item.likes}</p> 
            <p>Dislikes: {item.dislikes}</p>
        </div>
    );
}