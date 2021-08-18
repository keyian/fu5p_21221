import React, {useEffect, useState} from 'react';
import './styles/User.css';
import ItemMap from './ItemMap';
import axios from 'axios';

export default function User(props) {
    console.log("we in userrr");
    console.log(props);
    //get the local storage...
    let user = JSON.parse(window.localStorage.getItem('userData'));    //populate favorites upon load?
    console.log("what does user in local storage look like...", user);
    function populateFavorites() {
        const [favorites, setFavorites] = useState([]);
        
        axios.get('/api/populate-user-favorites',
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
            setFavorites(user.favorites);
        })
        .catch((error) => {
            console.log('Error retrieving populate favorites data!**: ', error);
        })
    }
    useEffect(() => { populateFavorites()}, []);
    return (
        <div id="userbg">
            <h1 id="userh1"> HELLO {user.name}</h1>
            <ItemMap items={favorites} />
        </div>
    );
}