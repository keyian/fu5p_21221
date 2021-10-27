import React from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';


import './styles/Item.css';


export default function Item(props) {
    //check for location state (means Item page clicked through Link)
    //no location state means person was linked, we need to request Item with populated comments

    const location = useLocation();
    console.log("this is location", location);
    let item;
    if(location.state) {
        item = JSON.parse(location.state);
    } else {
        item = requestItem()
    }
    // let item = (location.state ? JSON.parse(location.state) : requestItem());
    

    async function requestItem() {
        let splitPath = location.pathname.split('/');
        let itemID = splitPath[splitPath.length-1];
        console.log("in request item");

        axios.get('/api/getOneItem', { params: {
            itemID: itemID
        }})
            .then((response) => {
              console.log("response is...", response);
              return response.data;
            })
            .catch((err) => {
              console.log('Error retrieving getItems data!**: ', err);
            });
    }

    return (
        <div>
            <h1>{item.name} @ {item.place.name}</h1>
            <p> test</p>
        </div>
    );
}