import React, {useContext, useState, useEffect} from 'react';
import ItemMap from './ItemMap';
import ItemFeed from './ItemFeed';
import ItemForm from './ItemForm';
import './styles/Home.css';
import ItemFinder from '../apis/ItemFinder';

import { AppContext } from '../context/AppContext';

export default function Home(props) {
    const [items, setItems] = useState([]);
    const {login, userData} = useContext(AppContext);



    function getItems() {
        console.log("Running get Items");
        const runGetItems = async () => {
            try {
                const itemsResponse = await ItemFinder.get('/get-items');
                console.log("response of getitems ", itemsResponse);
                setItems(itemsResponse.data.data.items);
            }
            catch(err) {
                console.log('Error retrieving getItems data!: ', err);
            }
        }
        if(items.length === 0){
        runGetItems();}
    }

       //trigger this when an item is added...
    const addItemB4Refresh = (nuItem) => {
        nuItem.name = userData.name;
        nuItem.picture = userData.picture;
        //action
        setItems([nuItem].concat(items));
    }

    useEffect(getItems, []);


    return (
        <div id="map-form-feed-div">
            <ItemMap items={items} />
            {(login)?<ItemForm addItem={addItemB4Refresh} /> : <h2 className="message">Login w FB Above</h2>}
            <div id="itemfeed-container">
                <ItemFeed items={items} />
            </div>
        </div>
    );
}