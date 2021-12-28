import React, {useContext, useState, useEffect} from 'react';
import ItemMap from './ItemMap';
import ItemFeed from './ItemFeed';
import NuItemFeed from './NuItemFeed';
import ItemForm from './ItemForm';
import './styles/Home.css';
import ItemFinder from '../apis/ItemFinder';

import { AppContext } from '../context/AppContext';

export default function Home(props) {
    const [items, setItems] = useState([]);
    const {login, userData} = useContext(AppContext);

    function deleteItem(deleted) {
        console.log("this calls delete item?", deleted);
        setItems([...items].filter(item => item.item_id != deleted));
    }

    //replaces item with edited item, after combining data...
    function editItem(edited) {
        console.log("edit item getting called...");
        edited = edited.data.item[0];

        const index = items.findIndex(item => item.item_id == edited.item_id);
        console.log("index is ", index);

        const nuItem = Object.assign({...items[index]}, edited);
        console.log("nuitem is...", nuItem);
        let nuItems = [...items];
        nuItems.splice(index, 1, nuItem);
        console.log("this is nuitems", nuItems);
        setItems(nuItems);
    }


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
            runGetItems();
        }
    }

       //trigger this when an item is added...
    const addItemB4Refresh = (nuItem) => {
        nuItem.name = userData.name;
        console.log("in additem... this is nuItem, this is items", nuItem, items);
        //action
        setItems([nuItem].concat(items));
    }

    useEffect(getItems, []);


    return (
        <div id="map-form-feed-div">
            <ItemMap items={items} />
            {(login)?<ItemForm addItem={addItemB4Refresh} /> : <h2 className="message">Login w FB Above</h2>}
            <div id="itemfeed-container">
                <NuItemFeed del={deleteItem} edit={editItem} items={items} />
            </div>
        </div>
    );
}