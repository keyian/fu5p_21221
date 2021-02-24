const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
  itemName: String,
  restaurant: String, //*** THIS IS A STUB FOR NOW... RESTAURANT WILL BE A MODEL */
  price: Number,
  description: String,
  date: {
    type: String,
    default: Date.now()
  }
});

ItemSchema.methods.giveImage

//Model
const Item = mongoose.model('Item', ItemSchema);

//Models can have methods too...
/*
* this can just be a fun little extra for whoever finds it
*/

ItemSchema.methods.speak = function () {
  const greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

module.exports = Item;
