const express =  require('express');
const router = express.Router();
const db = require('../db');



const imgLoc = 'images/uploads';

const Item = require('../models/item');
const Place = require('../models/place');
const User = require('../models/user');
const Comment = require('../models/comment');

//Routes

router.post("/v1/comments/add-comment", function(req, res){
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
      Item.findOne({_id: comment.item}, function (err, item) {
        if(err) {
          console.log("Error at finding item  in comments..", err)
          return;
        }

        item.comments.push(comment._id);

        item.save(function(err, item) {
          res.send(comment);
        })
      })
    }
  })
})

router.post('/v1/likes/like-click', (req, res) => {
  let { userID, itemID, liked, disliked, oldLiked, oldDisliked } = req.body;
  if(userID){
    Item.findOne({_id: itemID}, function(err, item) {
      if(err) {
        console.log("error finding item to favorite...", err);
        return;
      }
      console.log("this is req.body", req.body);
      //no matter what like goes up, or it wouldnt be liked.
      if(liked) {
        item.likes++;
        if(oldDisliked) {
          item.dislikes--;
        }
      } else if (disliked) {
        item.dislikes++;
        if(oldLiked) {
          item.likes--;
        }
      } else if (oldLiked) {
        item.likes--;
      } else if (oldDisliked) {
        item.dislikes--;
      }

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
            user.liked.push(item._id);

            if(oldDisliked) {
              let index = user.disliked.indexOf(item._id);
              user.disliked.splice(index, 1);
            } 
          } else if (disliked) {
            user.disliked.push(item._id);
            if(oldLiked) {
              let index = user.liked.indexOf(item._id);
              user.liked.splice(index, 1);
            }
          } else if (oldLiked) {
            let index = user.liked.indexOf(item._id);
            user.liked.splice(index, 1);
          } else if (oldDisliked) {
            let index = user.disliked.indexOf(item._id);
            user.disliked.splice(index, 1);
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

router.get('/v1/comments/get-comments', (req, res) => {
  let itemID = req.query.itemID;
  Comment.find({'item': itemID}).exec(
    function(err, comments, count) {
      if(err) {
        console.log("Error while getting comments... ", error);
      } else {
        res.send(comments);
      }
    }
  )
  console.log('getComments', itemID);
});


router.get('/v1/items/get-items', async (req, res) => {
  try {
    const results = await db.query("select * from items");
    res.status(200).json({
        status: "success",
        results: results.rows.length,
        data: {
            items: results.rows
        }
    });
  } catch(err) {
      console.log(err);
  }
});

router.get('/v1/items/get-one-item', (req, res) => {
  console.log("in getOneItem");
  Item.findById(req.query.itemID).populate({
    path: 'comments'
  }).exec(function(err, item) {
    if(err) {
      console.log("error getting populated item", err);
      return;
    }
    res.send(item);
  })
})

router.get('/v1/users/populate-user-favorites', (req, res) => {
  console.log("in populate user", req.query.userID);
  let userID = req.query.userID;
  User.findById(userID)
  .populate({
    path: 'liked',
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

router.post('/v1/items/save-item', (req, res) => {
  
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
      likes: 0,
      dislikes: 0,
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

router.post('/v1/users/save-user', async (req, res) => {
  const data = req.body;

  try {
    //eventually this should  figure out the fb picture situation
    const results = await db.query(
      "INSERT INTO users (name, picture, facebook_id, email) values ($1, $2, $3, $4) on conflict(facebook_id) do nothing returning *", [data.name, data.picture, data.fbid, data.email]
    );

    console.log(results.rows[0]);

    res.status(201).json({
      status: "success",
      user: results.rowCount > 0 ? results.rows[0] : data
    });

  } catch(err) {
    console.log(err);
  }

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
