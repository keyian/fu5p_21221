import React, {useState, useEffect} from 'react';
import ItemMap from './ItemMap';
import ItemFeed from './ItemFeed';
import ItemForm from './ItemForm';
import './styles/Home.css';
import ItemFinder from '../apis/ItemFinder';

export default function Home(props) {
    const [items, setItems] = useState([]);
    const login = props.login;
    const userData = props.userData;

    function getItems() {
        if(items.length === 0){
            ItemFinder.get('/get-items')
            .then((response) => {
              setItems(response.data.data.items);
            })
            .catch((err) => {
              console.log('Error retrieving getItems data!**: ', err);
            });
        }
      }

       //trigger this when an item is added...
    const addItemB4Refresh = (nuItem) => {
        //action
        setItems(items.concat(nuItem));
    }

    useEffect(getItems, []);


    return (
        <div id="map-form-feed-div">
            <ItemMap items={items} setItems={setItems} />
            {(login)?<ItemForm login={login} addItem={addItemB4Refresh} userData={userData} /> : <h2 className="message">Login w FB Above</h2>}
            <div id="itemfeed-container">
                <ItemFeed items={items} user={userData} login={login} />
            </div>
        </div>
    );
}