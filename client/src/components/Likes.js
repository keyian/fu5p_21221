import React, { useContext, useState } from 'react';
import './styles/Likes.css';
import Liker from '../apis/Liker';
import { AppContext } from '../context/AppContext';
import {updateLikes} from '../helpers/updateLikes';


export default function Likes({like, item, ...props}) {
    //helper variables
    const {userData, login, setUserData} = useContext(AppContext);
    // const [item, setItem] = useState(props.item);
    // const [likes, setLikes] = useState(item.likes);
    console.log("this is literally item, right before likes...", item);
    const likes = item.likes;
    const [liked, setLiked] = useState(login ? userData.itemLikes.includes(item.item_id): false);
    const [disliked, setDisliked] = useState(login ? userData.itemDislikes.includes(item.item_id) : false);

    const socket = props.socket;

    socket.on(`server-new-like-${item.item_id}`, (like) => {
        if(like.itemID === item.item_id) {
            console.log("in correct item");
            // setLikes(likes + like.likeChange);
            like(item.item_id, like.likeChange);
        }
        
    })

  

    async function handleClick(action) {
        //preserve so db knows what to do 
        let oldLiked = liked;
        let oldDisliked = disliked;
        //need to send data this way because of Hook being inside state-closure
        let nuLiked = false;
        let nuDisliked = false;
        console.log(liked, disliked);
        console.log(action);
        if(action === "like") {
            console.log('in like acion');
            if(oldLiked) {
                console.log("was liked, like clicked");
                setLiked(false);
                nuLiked = false;
                console.log(liked);

                // setLikes(likes -1);
                like(item.item_id, -1);
            } else {
                console.log("was not liked, like clicked");
                setLiked(true);
                nuLiked = true;
                setDisliked(false);
                nuDisliked = false;

                // setLikes((oldDisliked ? likes + 2 : likes + 1));
                like(item.item_id, (oldDisliked ? 2 : 1));
            }
        } else {
            if(oldDisliked) {
                console.log("was disliked, dislike clicked");

                setDisliked(false);
                nuDisliked = false;

                // setLikes(likes +1);
                like(item.item_id, 1);

            } else {
                console.log("was not disliked, dislike clicked");

                setDisliked(true);
                nuDisliked = true;
                setLiked(false);
                nuLiked = false;

                // setLikes((oldLiked ? likes - 2 : likes - 1));
                like(item.item_id, (oldLiked ? -2 : -1));

            }
        }

        updateLikes(oldLiked, oldDisliked, action, userData, setUserData, item.item_id);
        // like(item.item_id, getLikeChange(oldLiked, oldDisliked, action));
        let body = {userID: userData.user_id, itemID: item.item_id, liked: nuLiked, disliked: nuDisliked, oldLiked: oldLiked, oldDisliked: oldDisliked}
        try {
            console.log("in try statement)");
            const itemLike = await Liker.post('/like-click', body);

            console.log("this is itemLike", itemLike);
            socket.emit("client-new-like", itemLike.data);
        } catch(error) {
            console.log("error in favorite-click: ", error);
        }
    }

    return(
        <div className="likes-container-div">
            {(login)?
                <div className="likes-div">
                    <div className="notFilled like-button" onClick={()=>handleClick("like")}>{liked ? <span role="img" aria-label="like">👍</span> : "⬆️" }</div>
                    <div className="notFilled like-button" onClick={()=>handleClick("dislike")}>{disliked ? <span role="img" aria-label="dislike">👎</span> : "⬇️"} </div>
                </div>
                :
                <p id="login-to-like-p"> login to like and dislike items! </p>
            }
            
            <div className="likes-count-div">
                <p>👍: {likes}</p>
            </div>
        </div>
    );
}