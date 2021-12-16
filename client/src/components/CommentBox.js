import React, {useState, useEffect} from 'react';
import './styles/CommentBox.css';
import Commenter from '../apis/Commenter';

export default function CommentBox(props) {
    const[comments, setComments] = useState([]);
    const[input, setInput] = useState("");
    const itemID = props.itemID;
    const user = props.user;
    const login = props.login;
    const scrollID = props.dataRef+"-scroll-div";
    console.log('this is scroll id', scrollID);
    const sock = props.sock;

    sock.onmessage = function(e) {
        console.log("sock on msg");
        const message = JSON.parse(e.data);
        console.log("this is mesage in sock.onmessage", message);
        if(message.type === "comment") { 
            if(itemID == message.data.item) {
                setComments(comments => [...comments, message.data]);
                console.log("this is comments post setComments", comments);
            }
        }         
    };

    function getComments() {
        // Commenter.get('/get-comments',
        // { params: {
        //     itemID: itemID
        // }}).then((response) => {
        //     setComments(response.data);
        //     console.log("get comments response", response);
        // })
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


    function submitComment() {
        // let comment = {comment: input, itemID: itemID, user: user}
        // setInput("");
        // Commenter.post("/add-comment", comment)
        // .then(res => {
        //     const json = {type: 'comment'};
        //     console.log("called add comment. now in socket portion");
        //     json.data = res.data;
        //     sock.send(JSON.stringify(json));
        // }
        // );
    }
    
    function scrollToBottom() {
        let commentsDiv =  document.getElementById(scrollID);
        commentsDiv.scrollTop = commentsDiv.scrollHeight;
        console.log('commentsDiv: ', commentsDiv);
    }

    useEffect(getComments, []);
    useEffect(scrollToBottom, [comments]);
    return(
        <div className="comments-container-div">
            <div id={scrollID} className="comments-scroll-div">
                <ul className="comments-ul">
                    {comments.map((comment, i) => <li key={i}><span className="comment-username-span">{comment.userName.split(" ")[0]}:</span> <span className="comment-span">{comment.text}</span></li>)}
                </ul>
            </div>
            <div className="comments-textarea-div">
                <textarea className="comments-textarea" value={input} style={{resize: "none"}} rows="4" placeholder="Comment..." onChange={handleChange} onKeyPress={handleEnter}>
                </textarea>
            </div>
        </div>
    )
}