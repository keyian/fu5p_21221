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
    const sock = props.sock;

    sock.onmessage = function(e) {
        console.log("sock on msg");
        const message = JSON.parse(e.data);
        console.log("this is mesage in sock.onmessage", message);
        if(message.type === "comment") { 
            console.log("this is itemID, this is message.data.item_id", itemID, message.data.item_id);
            if(itemID == message.data.item_id) {
                setComments(comments => [...comments, message.data]);
                console.log("this is comments post setComments", comments);
            }
        }         
    };

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
        const json = {type: 'comment'};
        console.log("called add comment. now in socket portion. added comment:", addedComment);
        json.data = addedComment.data.comment;
        console.log("Json", json);
        sock.send(JSON.stringify(json));
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