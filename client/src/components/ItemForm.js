import React, { useState } from 'react';
import './../App.css';
import Button from './Button.js';
import axios from 'axios';

export default function ItemForm(cb) {
  const [itemName, setItemName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const clear = () => {
    this.setItemName('');
    this.setRestaurant('');
    this.setPrice('');
    this.setDescription('');
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
    alert('An item was submitted: ' + itemName);
    const payload = {
      itemName: itemName,
      restaurant: restaurant,
      price: price,
      description: description
    };
    
    axios({
      url: '/api/save',
      method: 'POST',
      data: payload
      })
      .then(() => {
        console.log('Data has been sent to the server');
        clear();
      })
      .catch((e) => {
        console.log("Internal server error: ", e);
      });
  };

  return (
      <form onSubmit={handleSubmit}>
        <label>What's under $5?</label>
        <input type="text" name="itemName" value={itemName} onChange={e => setItemName(e.target.value)} />
        
        <label>Restaurant</label>
          <input type="text" name="restaurant" value={restaurant} onChange={e => setRestaurant(e.target.value)} />
        
        <label>Price</label>
          <input type="text" name="price" value={price} onChange={e => setPrice(e.target.value)} />
        <label>Description/Any comments?</label>
          <textarea rows="4" cols="50" name="description" value={description} onChange={e => setDescription(e.target.value)} />
        <br />
        <Button>SUBMIT</Button>
      </form>
    );
}