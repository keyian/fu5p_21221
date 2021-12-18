import React, { useContext, useState, useEffect } from 'react';
import './styles/Likes.css';
import Liker from '../apis/Liker';
import { AppContext } from '../context/AppContext';



export default function Likes(props) {
    //helper variables
    const {userData, login, setUserData} = useContext(AppContext);
    const [item, setItem] = useState(props.item);
    const [likes, setLikes] = useState(item.likes);
    const [dislikes, setDislikes] = useState(item.dislikes);
    const [liked, setLiked] = useState(login ? userData.like_status==1: false);
    const [disliked, setDisliked] = useState(login ? userData.like_status==-1 : false);

    function isItemLiked() {
        // console.log("isItemLiked iteration");
        //determine logic later, after testing liking
        // setLiked(login ? user.liked.includes(item._id) : false);
    }

    function isItemDisliked() {
        // console.log("isItemDisLiked iteration");
        //determine logic later, after testing liking
        // setDisliked(login ? user.disliked.includes(item._id) : false);
    }

    const sock = props.sock;

    sock.onmessage = function(e) {
        console.log("sock on msg");
        const message = JSON.parse(e.data);
        console.log("this is mesage in sock.onmessage", message);
        if(message.type === "likes") { 
            if(item._id == message.data._id) {
                setLikes(message.data.likes);
                setDislikes(message.data.dislikes);
            }
        }         
    };

    function handleClick(action) {
        //preserve so db knows what to do 
        let oldLiked = liked;
        let oldDisliked = disliked;
        //need to send data this way because of Hook being inside state-closure
        let nuLiked = false;
        let nuDisliked = false;
        console.log(liked, disliked);
        console.log(action);
        if(action == "like") {
            console.log('in like acion');
            if(oldLiked) {
                // ** setLiked(false);
                nuLiked = false;
                console.log(liked);
            } else {
                //** */ setLiked(true);
                nuLiked = true;
                //** */ setDisliked(false);
                nuDisliked = false;
            }
        } else {
            if(oldDisliked) {
                //** */ setDisliked(false);
                nuDisliked = false;
            } else {
                // **setDisliked(true);
                nuDisliked = true;
                //** */ setLiked(false);
                nuLiked = false;
            }
        }

        let body = {userID: userData._id, itemID: item._id, liked: nuLiked, disliked: nuDisliked, oldLiked: oldLiked, oldDisliked: oldDisliked}
        
        Liker.post('/like-click', body)
        .then((res)=>{
                let {item, user} = res.data;
                console.log(user);
                //update everything
                 window.localStorage.setItem('userData', JSON.stringify(user));
                 setUserData(user);
                 setItem(item);
                 
                 const json = {type: 'likes'};
                 json.data = item;
                 sock.send(JSON.stringify(json));
            })
        .catch((error)=>console.log("error in favorite-click: ", error));
    }

    useEffect(()=>{isItemLiked(); isItemDisliked();}, [userData]);

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
                <p>👍: {likes}&nbsp;&nbsp;&nbsp;</p>
                <p>👎: {dislikes}</p>
            </div>
        </div>
    );
}