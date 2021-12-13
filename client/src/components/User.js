import React, {useEffect, useState} from 'react';
import './styles/User.css';
import ItemMap from './ItemMap';
import ItemFeed from './ItemFeed';
import UserFinder from '../apis/UserFinder';

export default function User(props) {
    //state
    const [favorites, setFavorites] = useState([]);

    const userData = props.userData;
    const login = props.login;

    console.log("we in userrr");
    console.log(props);
    //get the local storage...
    let user = JSON.parse(window.localStorage.getItem('userData'));    //populate favorites upon load?
    function populateFavorites() {
        
        UserFinder.get('/populate-user-favorites',
            { params: {
                    userID: user._id
                }
            }
        )
        .then((response) => {
            //TODO: check on this once favorites have been configured.
            //for now, just logging the response, which is the POPULATED user.
            let user = response.data;
            console.log("populate favorites response: ", user);
            setFavorites(user.liked);
        })
        .catch((error) => {
            console.log('Error retrieving populate favorites data!**: ', error);
        })
    }
    useEffect(populateFavorites, []);
    return (
        <div id="userbg">
            {/* <Header loginHooks={props.loginHooks}/> */}
            <h1 id="userh1"> HELLO {user.name}</h1>
            <ItemMap items={favorites} />
            <ItemFeed items={favorites} login={login} user={userData} />
        </div>
    );
}