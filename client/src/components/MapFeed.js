import React, {useContext, useState, useEffect} from 'react';
import ItemMap from './ItemMap';
import NuItemFeed from './NuItemFeed';
import ItemFinder from '../apis/ItemFinder';
import { AppContext } from '../context/AppContext';

//react-bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function MapFeed(props) {
    const {items, setItems} = props;
    const [center, setCenter] = useState([]);

    const  deleteItem = (deleted) => {
        console.log("this calls delete item?", deleted);
        //set items to a new array with deleted item id filtered out
        setItems([...items].filter(item => item.item_id !== deleted));
    }

    //replaces item with edited item, after combining data...
    const editItem = (edited) => {
        console.log("edit item getting called...");
        //clean item
        edited = edited.data.item[0];

        //find index
        const index = items.findIndex(item => item.item_id === edited.item_id);
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

    const likeItem = (likedItemID, likeChange) => {
        //on like, report back and change item likes
        const index = items.findIndex(item => item.item_id === likedItemID);

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

    function markerClick(coords) {
        setCenter(coords);
    }

    useEffect(getItems, []);


    return (
        <Row>
            <Col xs={12} sm={12} md={6}>
                <ItemMap center={center} items={items} />
            </Col>
            <Col xs={12} sm={12} md={6}>
                <NuItemFeed click={markerClick} del={deleteItem.bind(this)} edit={editItem.bind(this)} like={likeItem.bind(this)} items={items} />
            </Col>
        </Row>
    );
}