import React, {useEffect, useState, useContext} from 'react';
import './styles/User.css';
import ItemMap from './ItemMap';
import ItemFeed from './ItemFeed';
import UserFinder from '../apis/UserFinder';
import { AppContext } from '../context/AppContext';

export default function User(props) {
    //state
    const [favorites, setFavorites] = useState([]);

    const {userData, login}  = useContext(AppContext);

    console.log("we in userrr");
    console.log(props);
    //get the local storage...
    // let user = JSON.parse(window.localStorage.getItem('userData'));    //populate favorites upon load?
    //commenting out because there's technically no need to populate favorites as of yet...
    // // function populateFavorites() {
        
    // //     UserFinder.get('/populate-user-favorites',
    // //         { params: {
    // //                 userID: userData.facebook_id
    // //             }
    // //         }
    // //     )
    // //     .then((response) => {
    // //         //TODO: check on this once favorites have been configured.
    // //         //for now, just logging the response, which is the POPULATED user.
    // //         let user = response.data;
    // //         console.log("populate favorites response: ", user);
    // //         setFavorites(user.liked);
    // //     })
    // //     .catch((error) => {
    // //         console.log('Error retrieving populate favorites data!**: ', error);
    // //     })
    // // }
    // useEffect(populateFavorites, []);
    return (
        <div id="userbg">
            {/* <Header loginHooks={props.loginHooks}/> */}
            <h1 id="userh1"> HELLO {userData.name}</h1>
            <ItemMap items={favorites} />
            <ItemFeed items={favorites} login={login} user={userData} />
        </div>
    );
}