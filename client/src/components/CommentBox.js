import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function CommentBox(props) {
    const[comments, setComments] = useState([]);
    const[input, setInput] = useState("");
    const itemID = props.itemID;
    

    function getComments() {
        axios.get('/api/get-comments',
        { params: {
            itemID: itemID
        }}).then((response) => {
            return;
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
        return;
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