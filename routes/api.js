const express =  require('express');

const router = express.Router();

const Item = require('../models/item');
const Place = require('../models/place');
const User = require('../models/user');

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
    items: [],
    placeId: data.placeId
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

router.post('/save-user', (req, res) => {
  const data = req.body;
  console.log("Here's req.body...", req.body);
  //add user's favorites (stub array), last-login (now), name, and email
  //  previous code
  //  User.findByIdAndUpdate({fbid: data.fbid}, {upsert: true, new: true}, (err, user) => {
  //   if(err) {
  //     console.log("Error while saving user: ", err);
  //   }
  //   console.log("THIS IS USER", user);
  //   res.send(user);
  // })


  //experiment with this
  //does user exist? Find
  User.findOneAndUpdate({fbid: data.fbid}, {upsert: true}, (err, user) => {
    if(err) {
      console.log("Error while saving user: ", err);
    } 
    if(!user) {
      console.log("in user didn exist section");
      new User({
        name: data.name,
        lastLogin: Date.now(),
        picture: data.picture,
        fbid: data.fbid,
        email: data.email
      }).save((error, user) => {
        console.log("we in user save");
        if(error) {
          console.log("in save error");
          res.status(500).json({msg: 'Sry, server error while adding user...'});
          return;
        }
        console.log("we in the post-save world");
        return res.json({
          msg: 'we gucci',
          user: user
        });
      })
    } else {
      console.log("we in  user already exists");
      user.lastLogin = Date.now();
      console.log(user.lastLogin);
      user.save();
    }
    console.log("THIS IS USER", user);
    res.send(user);
  });
});

router.post('/save', (req, res) => {
  console.log("Body: ", req.body.fbid);
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
