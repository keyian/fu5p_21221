import React, {useEffect, useState, useContext} from 'react';
import './styles/User.css';
import ItemMap from './ItemMap';
import ItemFeed from './ItemFeed';
import UserFinder from '../apis/UserFinder';
import { AppContext } from '../context/AppContext';
import { useLocation } from "react-router-dom";
import manicureUserData from '../helpers/manicureUserData';

export default function User(props) {
    //state
    const [favorites, setFavorites] = useState([]);
    const {userData, login}  = useContext(AppContext);
    const [userFirstName, setUserFirstName] = useState("");
    const location = useLocation();


    console.log("we in userrr");
    console.log(props);
    //get the local storage...
    // let user = JSON.parse(window.localStorage.getItem('userData'));    //populate favorites upon load?
    //commenting out because there's technically no need to populate favorites as of yet...
    function populateFavorites() {
        let splitPath = location.pathname.split('/');
        let userID = splitPath[splitPath.length-1];
        console.log('userdata in user', userData);
        console.log('userid in user', userID);
        

        const runPopulateFavorites = async () => {
            try{
                const user = await UserFinder.get(`/populate-user-favorites/${userID}`);
                setUserFirstName(user.data.userLikes[0].name.split(" ")[0]);

                console.log("populate favorites response: ", user);
                setFavorites(user.data.userLikes.filter((item => {
                    return item.like_status;
                })));     
                
            }
            
            catch(error) {
                console.log('Error retrieving populate favorites data!**: ', error);
            }
        } 

        runPopulateFavorites();
        
    }

    
    useEffect(populateFavorites, [userData]);
    return (
        <div id="userbg">
            {/* <Header loginHooks={props.loginHooks}/> */}
            <h1 className="userWhite">{userFirstName}'s Page</h1>
            {favorites.length === 0 ? <p className="userWhite"> {userFirstName} has no favorites</p> : <ItemMap items={favorites} />}
            {favorites.length === 0 ? "" : <ItemFeed items={favorites} />}
        </div>
    );
}