const mongoose = require('mongoose');

// Schema
const ItemSchema = new mongoose.Schema({
  name: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  price: {type: Number, required: true},
  place: {type: mongoose.Schema.Types.ObjectId, ref: 'Place'},
  favorites: {type: Number, required: false},
  imgPath: {type: String, required: false},
  videoUrl: {type: String, required: false}
},
{
  timestamps: true
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
