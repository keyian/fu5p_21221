import React, { useState } from 'react';
import './../App.css';
import Button from './Button.js';

export default function ItemForm() {
  const [item, setItem] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
      alert('An item was submitted: ' + this.state.item);
      e.preventDefault();
      this.setItem('');
      this.setRestaurant('');
      this.setPrice('');
      this.setDescription('');
  }

  return (
      <form onSubmit={handleSubmit}>
        <label>Item</label>
        <input type="text" name="item" value={item} onChange={e => setItem(e.target.value)} />
        
        <label>Restaurant</label>
          <input type="text" name="restaurant" value={restaurant} onChange={e => setRestaurant(e.target.value)} />
        
        <label>Price</label>
          <input type="text" name="price" value={price} onChange={e => setPrice(e.target.value)} />
        <br />
        <Button>SUBMIT</Button>
      </form>
    );
}