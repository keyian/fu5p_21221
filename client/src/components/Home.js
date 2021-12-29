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

    const  deleteItem = (deleted) => {
        console.log("this calls delete item?", deleted);
        //set items to a new array with deleted item id filtered out
        setItems([...items].filter(item => item.item_id != deleted));
    }

    //replaces item with edited item, after combining data...
    const editItem = (edited) => {
        console.log("edit item getting called...");
        //clean item
        edited = edited.data.item[0];

        //find index
        const index = items.findIndex(item => item.item_id == edited.item_id);
        console.log("index is ", index);

        //overwrite data (has more data) on old item with new data on new item
        const nuItem = Object.assign({...items[index]}, edited);
        console.log("nuitem is...", nuItem);
        //copy items array
        let nuItems = [...items];
        //splice new item into array
        nuItems.splice(index, 1, nuItem);
        console.log("this is nuitems", nuItems);
        //set items to copied array
        setItems(nuItems);
    }

    //trigger this when an item is added...
    const addItem = (nuItem) => {
        //add on user info (which will be loaded upon refresh)
        nuItem.name = userData.name;
        console.log("in additem... this is nuItem, this is items", nuItem, items);
        //temporarily set items as new array with newly-returned item appended.
        setItems([nuItem].concat(items));
    }

    const likeItem = (likedItemID, likeChange) => {
        //on like, report back and change item likes
        const index = items.findIndex(item => item.item_id == likedItemID);

        const nuItems = [...items];
        nuItems[index].likes += likeChange;

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



    useEffect(getItems, []);


    return (
        <div id="map-form-feed-div">
            <ItemMap items={items} />
            {(login)?<ItemForm addItem={addItem} /> : <h2 className="message">Login w FB Above</h2>}
            <div id="itemfeed-container">
                <NuItemFeed del={deleteItem} edit={editItem} like={likeItem} items={items} />
            </div>
        </div>
    );
}