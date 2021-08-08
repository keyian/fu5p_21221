import React, { useState } from 'react';
import './../App.css';
import Button from './Button.js';
import GMapsAutoCompleteWrapper from './GMapsAutoCompleteWrapper.js';
import axios from 'axios';

export default function ItemForm(props) {
  const [itemName, setItemName] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  //try passing the GMapsAutoCompleteWrapper (object) hook from above...
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
      lat: null,
      lng: null
  });

  /*
  * Clears the form, called after submit has been processed. 
  */
  const clear = () => {
    setItemName('');
    setPlaceName('');
    setPrice(0);
    setDescription('');
    setAddress('');
    setCoordinates({lat: null, lng: null});
  }

  /*
  * Stub for method that will retrieve items from database and post.
  */
  const getItems = () => {
    //this is a stub for now
    return;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      itemName: itemName,
      placeName: placeName,
      price: price,
      description: description,
      address: address,
      coordinates: coordinates
    };
    
    axios({
      url: '/api/saveItem',
      method: 'POST',
      data: payload
      })
      .then((item) => {
        console.log('Data has been sent to the server');
        props.addItem(item.data);
        clear();
      })
      .catch((e) => {
        console.log("Internal server error: ", e);
      });
  }; 

  return (
      <form method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
        <label>What's under $5?</label>
        <input type="text" name="itemName" value={itemName} onChange={e => setItemName(e.target.value)} />
        <GMapsAutoCompleteWrapper hooks={{address, setAddress, coordinates, setCoordinates, placeName, setPlaceName}} />
        <label>Price</label>
          <input type="text" name="price" value={price} onChange={e => setPrice(e.target.value)} />
        <label>Image</label>
          <textarea rows="4" cols="50" name="description" value={description} onChange={e => setDescription(e.target.value)} />
        <label>Description/Any comments?</label>
          <textarea rows="4" cols="50" name="description" value={description} onChange={e => setDescription(e.target.value)} />
        <br />
        <Button>SUBMIT</Button>
      </form>
    );
}