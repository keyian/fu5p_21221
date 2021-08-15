const express =  require('express');
const axios = require('axios');
const router = express.Router();


const imgLoc = 'images/uploads';

const Item = require('../models/item');
const Place = require('../models/place');
const User = require('../models/user');

//Routes

router.get('/getItems', (req, res) => {
  Item.find({}).populate('place').then((data) => {
    res.json(data);
  })
  .catch((error) => {
    console.log('error: ', error)
  });
});

router.post('/saveItem', (req, res) => {
  
  let data = req.body;
  console.log("data: ", data);
  //does place exist?
  let placeFields = {
    name: data.placeName,
    formatted_address: data.address,
    coordinates: data.coordinates,
    items: [],
    placeId: data.placeId
  };

  createOrFindPlace(placeFields).then((place) => {
    console.log("this is place: ", place);
    console.log("this is data.localImageLoc", data.localImageLoc);

     new Item({
      name: data.itemName,
      creator: data.user,
      price: data.price,
      place: place,
      favorites: 0,
      img:  data.localImageLoc,
      videoUrl: ''
    }).save(function(err, item, count){
      if(err) {
        console.log("Error saving item..." , err);
      } else {
        place.items.push(item);
        place.save(function(err, pl, count) {
          // do nothing
          res.json(item);
        });
      }
    });
  }).catch((error) => console.log("There was an error during create or find place...: ", error));
});

router.post('/save-user', (req, res) => {
  const data = req.body;

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
        return res.send(user);
      })
    } else {
      console.log("we in  user already exists");
      user.lastLogin = Date.now();
      console.log(user.lastLogin);
      user.save((error, user) => {
        if(!error) { 
         res.send(user);
        } else {
          console.log("error in saving user, here it is ", user);
        }
      });
    }
  });
});


//helperzzz

async function createOrFindPlace(placeFields) {
  let placePromise = await new Promise((resolve, reject) => {
    Place.findOneAndUpdate(
      {placeId: placeFields.placeId}, 
      {upsert: true}, 
      (err, place) => {
        if(err) {
          console.log("Error while saving place: ", err);
        } 
        //if place wasn't found
        if(!place) {
          console.log("in place didn exist section\nhere is placefields: ", placeFields);
          Place({
              name: placeFields.name,
              formatted_address: placeFields.address,
              coordinates: placeFields.coordinates,
              items: [],
              placeId: placeFields.placeId
            }).save(async (error, place) => {
              console.log("we in place save");
              if(error) {
                console.log("in save error");
                res.status(500).json({msg: 'Sry, server error while adding place...'});
                reject('ERror with place saving');
              } else {
                console.log("No error, here is place: ", place);
                resolve(place);
              }
              console.log("we in the post-save place world");
            });
        } else {
          resolve(place);
        }
    });
  });
  return placePromise;
}







module.exports = router;
