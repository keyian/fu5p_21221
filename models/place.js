const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const PlaceSchema = new Schema({
  name: {type: String, required: true},
  formatted_address: {type: String, required: true},
  coordinates: {
      lat: Number,
      lng: Number
  }, 
  items: {type: [mongoose.Schema.Types.ObjectId], ref: "Item", required: true},
});

//Model
const Place = mongoose.model('Place', PlaceSchema);


module.exports = Place;