const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const PlaceSchema = new Schema({
  name: {type: String, required: false},
  formatted_address: {type: String, required: false},
  coordinates: {
      lat: Number,
      lng: Number
  }, 
  items: {type: [mongoose.Schema.Types.ObjectId], ref: "Item", required: false},
  placeId: {type: String, required: false}
});

//Model
const Place = mongoose.model('Place', PlaceSchema);


module.exports = Place;