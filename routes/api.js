const express =  require('express');

const router = express.Router();

const Item = require('../models/item');
const Place = require('../models/place');


//Routes

router.get('/getItems', (req, res) => {
  Item.find({}).populate('place').then((data) => {
    console.log('Data: ', data);
    res.json(data);
  })
  .catch((error) => {
    console.log('error: ', error)
  });
});

router.post('/saveItem', (req, res) => {
  let data = req.body;
  new Place({
    name: data.placeName,
    formatted_address: data.address,
    coordinates: data.coordinates,
    items: []
  }).save(function(err, pl, count) {
    if(err) {
      console.log("Error saving place...");
    } else {
      new Item({
        name: data.itemName,
        price: data.price,
        place: pl,
        favorites: 0,
        imgPath: '',
        videoUrl: ''
      }).save(function(err, item, count){
        if(err) {
          console.log("Error saving item...");
        } else {
          pl.items.push(item);
          pl.save(function(err, pl, count) {
            // do nothing
            res.send(item);
          });
        }
      });
    }
  });
});

router.post('/save', (req, res) => {
  console.log("Body: ", req.body);
  const data = req.body;

  const newItem = new Item(data);

  // .save
  newItem.save((error) => {
    if(error) {
      res.status(500).json({ msg: 'Sorry, internal server errors' });
      return;
    } 
      // Item
    return res.json({
        msg: "Your data has been saved!!!!!"
    });
    
  });

  
});

module.exports = router;
