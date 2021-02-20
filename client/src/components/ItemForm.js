import React from 'react';
import './../App.css';
import Button from './Button.js';


class ItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: '',
      restaurant: '',
      price: 0,
      description: '',
      
      };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log(event.target);
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Item</label>
        <input type="text" name="item" value={this.state.item} onChange={this.handleChange} />
        
        <label>Restaurant</label>
          <input type="text" name="restaurant" value={this.state.restaurant} onChange={this.handleChange} />
        
        <label>Price</label>
          <input type="text" name="price" value={this.state.price} onChange={this.handleChange} />
        <br />
        <input type="submit" value="Submit" />
        <Button>Keyian test</Button>
      </form>
    );
  }
}

export default ItemForm;