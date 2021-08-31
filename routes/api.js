const express =  require('express');
const axios = require('axios');
const router = express.Router();


const imgLoc = 'images/uploads';

const Item = require('../models/item');
const Place = require('../models/place');
const User = require('../models/user');
const Comment = require('../models/comment');

//Routes

router.post("/add-comment", function(req, res){
  let comment = req.body;
  new Comment({
    text: comment.comment,
    item: comment.itemID,
    user: comment.user._id,
    userName: comment.user.name
  }).save(function(err, comment) {
    if(err) {
      console.log("Error adding comment...", err);
    } else {
      User.findOne({_id: comment.user}, function (err, user) {
        if(err) {
          console.log("Error at finding user  in comments..", err)
          return;
        }

        user.comments.push(comment._id);

        user.save(function(err, user) {
          res.send(comment);
        })
      })
    }
  })
})

router.post('/favorite-click', (req, res) => {
  let { userID, itemID, liked } = req.body;
  console.log(userID);
  if(userID){
  Item.findOne({_id: itemID}, function(err, item) {
    if(err) {
      console.log("error finding item to favorite...", err);
      return;
    }
    (liked) ? item.favorites-- : item.favorites++;
    item.save(function(err, item) {
      if(err) {
        console.log("error saving item favorite change");
        return;
      }
      User.findOne({_id: userID}, function(err, user) {
        if(err) {
          console.log("error finding user to change favorite", err);
          return;
        } 
        if(liked) {
          let index = user.favorites.indexOf(item._id);
          user.favorites.splice(index, 1);
        } else {
          user.favorites.push(item._id);
        }
        user.save(function(err, user) {
          if(err) {
            console.log("error saving user favorie change", err);
            return;
          }
          res.send({item: item, user: user});
        });
    });
  });

  });
  } 
});

router.get('/get-comments', (req, res) => {
  let itemID = req.query.itemID;
  Comment.find({'item': item}).exec(
    function(err, comments, count) {
      if(err) {
        console.log("Error while getting comments... ", error);
      }
      res.send(comments);
    }
  )
  console.log('getComments', itemID);
});


router.get('/getItems', (req, res) => {
  Item.find({}).populate('place').then((data) => {
    res.json(data);
  })
  .catch((error) => {
    console.log('error: ', error)
  });
});

router.get('/populate-user-favorites', (req, res) => {
  console.log("in populate user", req.query.userID);
  let userID = req.query.userID;
  User.findById(userID)
  .populate({
    path: 'favorites',
    populate: {path: 'place'}
  })
  .exec(function(err, user) {
    if(err) {
      console.log("error getting populated user", err);
      return;
    }
    res.send(user);
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
