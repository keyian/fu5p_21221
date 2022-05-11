import React, {useState, useContext} from 'react';
import { AppContext } from '../context/AppContext';
import './styles/CommentBox.css';
import Follower from '../apis/Follower';


//assumes user id is provided
export default function FollowButton(props) {
    const {userData}  = useContext(AppContext);
    const followed_id = props.userID;
    const [followed, setFollowed] = useState(false);

    const followUser = async () => {
        const follow = await Follower.post('change-follow', {following_id: userData.user_id, followed_id});
        setFollowed(follow);
    }


    function getFollowStatus() {
        const runGetFollowStatus = async () => {
            const followed = await Follower.get(`get-follow/${userData.user_id}/${followed_id}`);

        }
    }
    
    return(
        <button className="follow-button" onClick={followUser}>
            <span>{followed?"Unfollow":"Follow"}</span>
        </button>
    )
}