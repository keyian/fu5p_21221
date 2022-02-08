import React, {useEffect, useState, useContext} from 'react';
import './styles/User.css';
import MapFeed from './MapFeed';
import UserFinder from '../apis/UserFinder';
import { AppContext } from '../context/AppContext';
import { useLocation } from "react-router-dom";

//react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function User(props) {
    //state
    const [favorites, setFavorites] = useState([]);
    const {userData}  = useContext(AppContext);
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
                console.log(user.data.userLikes);
                setUserFirstName(user.data.userLikes[0].user_name.split(" ")[0]);

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

    
    useEffect(populateFavorites, [location]);
    return (
        <Container id="userbg">
            <Row>
                {/* <Header loginHooks={props.loginHooks}/> */}
                <h1 className="userWhite">{userFirstName}'s Likes</h1>
                <MapFeed parent="user" items={favorites} setItems={setFavorites} />
                {/* {favorites.length === 0 ? <p className="userWhite"> {userFirstName} has no favorites</p> : <ItemMap items={favorites} />}
                {favorites.length === 0 ? "" : <NuItemFeed items={favorites} />} */}
            </Row>
            
        </Container>
    );
}