import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from "react-router-dom";
import ItemFinder from '../apis/ItemFinder';
import ItemMap from './ItemMap';
import ItemFeed from './ItemFeed';
import { AppContext } from '../context/AppContext';
import EditItemButtons from './EditItemButtons';
import './styles/Item.css';


export default function Item(props) {
    //check for location state (means Item page clicked through Link)
    //no location state means person was linked, we need to request Item with populated comments
    const {userData} = useContext(AppContext);
    const location = useLocation();

    const [item, setItem] = useState([]);
    const userIsCreator = (userData.user_id === item.creator_id);

    
    useEffect( () => {
        console.log("are we in useeffect?");
        const requestItem = async () => {
            let splitPath = location.pathname.split('/');
            let itemID = splitPath[splitPath.length-1];
            console.log("In use effect request item");
            try {
                let itemResults = await ItemFinder.get(`/get-one-item/${itemID}`)
                setItem(itemResults.data.results);
                console.log(itemResults)
            } catch(err) {
                console.log('Error retrieving getItems data!**: ', err);
            }
        };

        requestItem();
    }, []);

    console.log("this is item in item", item);


    const handleItemEdit = (nuItem) => {
        
    }

    return (item.item_name) ? (
        
        <div>
            
            {console.log(item)}
            {userIsCreator ? <EditItemButtons editItemCallback={handleItemEdit} /> : <p>you can't edit or deletet</p>}
            <h1>{item.item_name} @ {item.place_name}</h1>
            <h2>added by {item.name.split(" ")[0]}</h2>
            <ItemMap items={[item]} />
            <ItemFeed items={[item]} />
        </div>
    ) : (<p>Item Page</p>);
}