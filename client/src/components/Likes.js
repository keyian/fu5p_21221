import React, { useContext, useState, useEffect } from 'react';
import './styles/Likes.css';
import Liker from '../apis/Liker';
import { AppContext } from '../context/AppContext';
import updateLikes from '../helpers/updateLikes';


export default function Likes(props) {
    //helper variables
    const {userData, login, setUserData} = useContext(AppContext);
    const [item, setItem] = useState(props.item);
    const [likes, setLikes] = useState(item.likes);
    const [liked, setLiked] = useState(login ? userData.like_status==1: false);
    const [disliked, setDisliked] = useState(login ? userData.like_status==-1 : false);

    const socket = props.socket;

    function isItemLiked() {
        console.log("isItemLiked iteration");
        //determine logic later, after testing liking
        setLiked(login ? userData.itemLikes?.includes(item.item_id) : false);
    }

    function isItemDisliked() {
        console.log("isItemDisLiked iteration");
        //determine logic later, after testing liking
        setDisliked(login ? userData.itemDislikes?.includes(item.item_id) : false);
    }

    socket.on(`server-new-like-${item.item_id}`, (like) => {
        if(like.itemID === item.item_id) {
            console.log("in correct item");
            setLikes(likes + like.likeChange);
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
        updateLikes(oldLiked, oldDisliked, action, setUserData, item.item_id);
        if(action === "like") {
            console.log('in like acion');
            if(oldLiked) {
                setLiked(false);
                nuLiked = false;
                console.log(liked);

                setLikes(likes -1);
            } else {
                setLiked(true);
                nuLiked = true;
                setDisliked(false);
                nuDisliked = false;

                setLikes((oldDisliked ? likes + 2 : likes + 1));
            }
        } else {
            if(oldDisliked) {
                setDisliked(false);
                nuDisliked = false;

                setLikes(likes +1);
            } else {
                setDisliked(true);
                nuDisliked = true;
                setLiked(false);
                nuLiked = false;

                setLikes((oldLiked ? likes - 2 : likes - 1));
            }
        }

        let body = {userID: userData.facebook_id, itemID: item.item_id, liked: nuLiked, disliked: nuDisliked, oldLiked: oldLiked, oldDisliked: oldDisliked}
        try {
            console.log("in try statement)");
            const itemLike = await Liker.post('/like-click', body);

            console.log("this is itemLike", itemLike);
            socket.emit("client-new-like", itemLike.data);
        } catch(error) {
            console.log("error in favorite-click: ", error);
        }
    }

    useEffect(()=>{isItemLiked(); isItemDisliked();}, [userData.itemLikes, userData.itemDislikes]);

    return(
        <div className="likes-container-div">
            {(login)?
                <div className="likes-div">
                    <div className="notFilled like-button" onClick={()=>handleClick("like")}>{liked ? "👍" : "⬆️" }</div>
                    <div className="notFilled like-button" onClick={()=>handleClick("dislike")}>{disliked ? "👎" : "⬇️"} </div>
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