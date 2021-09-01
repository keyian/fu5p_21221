import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function CommentBox(props) {
    const[comments, setComments] = useState([]);
    const[input, setInput] = useState("");
    const itemID = props.itemID;
    const user = props.user;
    const login = props.login;
    
    const sock = props.sock;

    sock.onmessage = function(e) {
        console.log("sock on msg");
        const message = JSON.parse(e.data);
        console.log("this is mesage in sock.onmessage", message);
        if(message.type === "comment") { 
            if(itemID == message.data.item) {
                console.log("this is comments post setComments", comments);
            }
        }         
    };

    function getComments() {
        axios.get('/api/get-comments',
        { params: {
            itemID: itemID
        }}).then((response) => {
            setComments(response.data);
            console.log("get comments response", response);
        })
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
        let comment = {comment: input, itemID: itemID, user: user}
        setInput("");
        axios.post("/api/add-comment", comment)
        .then(res => {
            const json = {type: 'comment'};
            console.log("called add comment. now in socket portion");
            json.data = res.data;
            sock.send(JSON.stringify(json));
        }
        );
    }

    useEffect(getComments, []);
    return(
        <div>
            <ul>
                {comments.map((comment, i) => <li key={i}><span>{comment.userName}:</span> {comment.text}</li>)}
            </ul>
            <textarea value={input} style={{resize: "none"}} rows="4" placeholder="Comment..." onChange={handleChange} onKeyPress={handleEnter}>
            </textarea>
        </div>
    )
}