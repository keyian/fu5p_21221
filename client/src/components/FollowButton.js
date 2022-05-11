import React, {useContext} from 'react';
import { AppContext } from '../context/AppContext';
import './styles/CommentBox.css';
import Follower from '../apis/Follower';


//assumes user id is provided
export default function FollowButton(props) {
    const {userData}  = useContext(AppContext);
    const followed_id = props.userID;

    const followUser = async () => {
        const follow = await Follower.post('add-follow', {following_id: userData.user_id, followed_id});
    }

    
    return(
        <button className="follow-button" onClick={followUser}>
            <span>+</span>
        </button>
    )
}