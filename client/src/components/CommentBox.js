import React, {useState, useEffect, useContext} from 'react';
import './styles/CommentBox.css';
import Commenter from '../apis/Commenter';
import { AppContext } from '../context/AppContext';

export default function CommentBox(props) {
    const[comments, setComments] = useState([]);
    const[input, setInput] = useState("");
    const itemID = props.itemID;
    const {userData} = useContext(AppContext);
    const scrollID = props.dataRef+"-scroll-div";
    const socket = props.socket;

    //individualized socket function, would that work?
    socket.on(`server-new-comment-${itemID}`, (comment) => {
        if(comment.item_id === itemID) {
            console.log("in correct item");
            setComments(comments.concat(comment));
        }
        
    })

    function getComments() {
        const runGetComments  =  async () => {
            const comments = await Commenter.get(`/get-comments/${itemID}`);
            console.log("get comments response", comments);
            setComments(comments.data);
        }

        runGetComments();
    }

    function handleChange(e){
        setInput(e.target.value);
    }

    function handleEnter(e) {
        if(e.key === "Enter") {
          e.preventDefault();
          submitComment();  
        }
    }


    async function submitComment() {
        let comment = {comment_text: input, 
            item_id: itemID, 
            user_id: userData.facebook_id, 
            user_name: userData.name}
        setInput("");
        const addedComment = await Commenter.post("/add-comment", comment);
        console.log("added comment:", addedComment);
        socket.emit("client-new-comment", addedComment.data.comment);
        setComments(comments.concat(addedComment.data.comment));
    }
    
    function scrollToBottom() {
        let commentsDiv =  document.getElementById(scrollID);
        commentsDiv.scrollTop = commentsDiv.scrollHeight;
    }

    useEffect(getComments, []);
    useEffect(scrollToBottom, [comments]);
    return(
        <div className="comments-container-div">
            <div id={scrollID} className="comments-scroll-div">
                <ul className="comments-ul">
                    {comments.map((comment, i) => 
                    <li key={i}>
                        <span className="comment-username-span">
                            {comment.user_name.split(" ")[0]}:
                        </span> 
                        <span className="comment-span">
                            {comment.comment_text}
                        </span>
                    </li>)}
                </ul>
            </div>
            <div className="comments-textarea-div">
                <textarea className="comments-textarea" value={input} style={{resize: "none"}} rows="4" placeholder="Comment..." onChange={handleChange} onKeyPress={handleEnter}>
                </textarea>
            </div>
        </div>
    )
}