const express =  require('express');
const router = express.Router();
const knex = require('../knex/knex.js');


const imgLoc = 'images/uploads';

// const Item = require('../models/item');
// const Place = require('../models/place');
// const User = require('../models/user');
// const Comment = require('../models/comment');

//Routes

router.post("/v1/comments/add-comment", async (req, res) => {
  let comment = req.body;
  try {
    const comment = await knex("comments").insert({
      item_id: comment.itemID,
      comment_text: comment.comment,
      user_id: comment.user._id,
      user_name: comment.user.name
    });
    
    res.send(comment);
  } catch (err) {
    console.log("error adding comment: ", err);
  }
  

  // new Comment({
  //   text: comment.comment,
  //   item: comment.itemID,
  //   user: comment.user._id,
  //   userName: comment.user.name
  // }).save(function(err, comment) {
  //   if(err) {
  //     console.log("Error adding comment...", err);
  //   } else {
  //     Item.findOne({_id: comment.item}, function (err, item) {
  //       if(err) {
  //         console.log("Error at finding item  in comments..", err)
  //         return;
  //       }

  //       item.comments.push(comment._id);

  //       item.save(function(err, item) {
  //         res.send(comment);
  //       })
  //     })
  //   }
  // })
})

router.post('/v1/likes/like-click', async (req, res) => {
  let { userID, itemID, liked, disliked, oldLiked, oldDisliked } = req.body;
  

  // if(userID){
  //   Item.findOne({_id: itemID}, function(err, item) {
  //     if(err) {
  //       console.log("error finding item to favorite...", err);
  //       return;
  //     }
  //     console.log("this is req.body", req.body);
  //     //no matter what like goes up, or it wouldnt be liked.
  //     if(liked) {
  //       item.likes++;
  //       if(oldDisliked) {
  //         item.dislikes--;
  //       }
  //     } else if (disliked) {
  //       item.dislikes++;
  //       if(oldLiked) {
  //         item.likes--;
  //       }
  //     } else if (oldLiked) {
  //       item.likes--;
  //     } else if (oldDisliked) {
  //       item.dislikes--;
  //     }

  //     item.save(function(err, item) {
  //       if(err) {
  //         console.log("error saving item favorite change");
  //         return;
  //       }
  //       User.findOne({_id: userID}, function(err, user) {
  //         if(err) {
  //           console.log("error finding user to change favorite", err);
  //           return;
  //         } 
  //         if(liked) {
  //           user.liked.push(item._id);

  //           if(oldDisliked) {
  //             let index = user.disliked.indexOf(item._id);
  //             user.disliked.splice(index, 1);
  //           } 
  //         } else if (disliked) {
  //           user.disliked.push(item._id);
  //           if(oldLiked) {
  //             let index = user.liked.indexOf(item._id);
  //             user.liked.splice(index, 1);
  //           }
  //         } else if (oldLiked) {
  //           let index = user.liked.indexOf(item._id);
  //           user.liked.splice(index, 1);
  //         } else if (oldDisliked) {
  //           let index = user.disliked.indexOf(item._id);
  //           user.disliked.splice(index, 1);
  //         }
  //         user.save(function(err, user) {
  //           if(err) {
  //             console.log("error saving user favorie change", err);
  //             return;
  //           }
  //           res.send({item: item, user: user});
  //         });
  //     });
  //   });

  //   });
  // } 
});

router.get('/v1/comments/get-comments', async (req, res) => {
  let itemID = req.query.itemID;
  try {
    const comments = await knex.select('*').from('comments').where({item_id: itemID});
    if(!comments) {
      console.log("no comments");
    } else {
      res.send(comments);
    }
  } catch(err) {
    console.log("Error getting comments: ", err);
  }
  
    
  // Comment.find({'item': itemID}).exec(
  //   function(err, comments, count) {
  //     if(err) {
  //       console.log("Error while getting comments... ", error);
  //     } else {
  //       res.send(comments);
  //     }
  //   }
  // )
  console.log('getComments item id..', itemID);
});


router.get('/v1/items/get-items', async (req, res) => {
  try {
    const response = await knex.select("*").from("items");
    console.log("response is...", response);
    res.status(200).json({
      status: "success",
      results: response.length,
      data: {
          items: response
      }
    }) 
  } catch(err) {
      console.log("Error getting items: ", err);
  }
});

router.get('/v1/items/get-one-item', async (req, res) => {
  try {
    console.log("in getOneItem");
    // const item  = await knex.select('*')
    // .from('items')
    // .where({item_id: req.query.itemID});


    const itemComments =  await knex.from('items')
      .innerJoin('comments', 'items.item_id', 'comments.item_id');

    res.send(itemComments);

  } catch (err) {
    console.log("Error getting ONE item: ", err);
  }
  
})

router.get('/v1/users/populate-user-favorites', async (req, res) => {
  try {
    console.log("in populate user", req.query.userID);
    let userID = req.query.userID;
    const userLikes = await knex.from("users")
      .innerJoin("item-likes", "users.user_id", "item-likes.user_id")
      .innerJoin("items", "item-likes.item_id", "items.item_id");
  
    res.send(userLikes);
  } catch (err) {
    console.log("Error populating user favorites: ", err);
  }
  

  // User.findById(userID)
  // .populate({
  //   path: 'liked',
  //   populate: {path: 'place'}
  // })
  // .exec(function(err, user) {
  //   if(err) {
  //     console.log("error getting populated user", err);
  //     return;
  //   }
  //   res.send(user);
  // });
});

router.post('/v1/items/save-item', async (req, res) => {
  try { 
  let data = req.body;
  console.log("data in save-item: ", data);

  const image = await saveImage(data.imagePayload);
  console.log("this is returned image after insert...", image);

  //does place exist?
  let placeFields = {
    name: data.placeName,
    formatted_address: data.address,
    coordinates: data.coordinates,
    items: [],
    placeId: data.placeId
  };

  const place = await createOrFindPlace(placeFields);
  console.log("this is place after insert: ", place);
  
  saveItem(data, place.place_id, image.image_id);

    //  new Item({
    //   name: data.itemName,
    //   creator: data.user,
    //   price: data.price,
    //   place: place,
    //   likes: 0,
    //   dislikes: 0,
    //   img:  data.localImageLoc,
    //   videoUrl: ''
    // }).save(function(err, item, count){
    //   if(err) {
    //     console.log("Error saving item..." , err);
    //   } else {
    //     place.items.push(item);
    //     place.save(function(err, pl, count) {
    //       // do nothing
    //       res.json(item);
    //     });
    //   }
    // });
  } catch (err) {
    console.log("There was an error during create or find place...: ", error);
  } 
});

router.post('/v1/users/save-user', async (req, res) => {
  const data = req.body;
  console.log("this is req.body in save-user", req.body);
  try {
  console.log("we made it to try");
   const user = await knex("users").insert({
      name: data.name,
      picture: data.picture,
      facebook_id: data.fbid,
      email: data.email
    })
    .onConflict("facebook_id")
    .ignore();
    res.status(201).json({
      status: "success",
    });
  } catch(err) {
    console.log(err);
  }

});


//helperzzz

async function createOrFindPlace(placeFields) {
  try {
    const place = await knex("places").insert({
      name: placeFields.name,
      formatted_address: placeFields.formatted_address,
      coordinates: [placeFields.coordinates.lat, placeFields.coordinates.lng],
      google_place_id: placeFields.placeId})
      .onConflict("google_place_id")
      .ignore().union(function() {
        this.from("places").where({google_place_id: placeFields.placeId});
      });
  
      console.log("Place in createOrFindPlace: ", place);
  
      return place;
  } catch (err) {
    console.log("Error creating or finding place: ", err);
  }
  
    // Place.findOneAndUpdate(
    //   {placeId: placeFields.placeId}, 
    //   {upsert: true}, 
    //   (err, place) => {
    //     if(err) {
    //       console.log("Error while saving place: ", err);
    //     } 
    //     //if place wasn't found
    //     if(!place) {
    //       console.log("in place didn exist section\nhere is placefields: ", placeFields);
    //       Place({
    //           name: placeFields.name,
    //           formatted_address: placeFields.address,
    //           coordinates: placeFields.coordinates,
    //           items: [],
    //           placeId: placeFields.placeId
    //         }).save(async (error, place) => {
    //           console.log("we in place save");
    //           if(error) {
    //             console.log("in save error");
    //             res.status(500).json({msg: 'Sry, server error while adding place...'});
    //             reject('ERror with place saving');
    //           } else {
    //             console.log("No error, here is place: ", place);
    //             resolve(place);
    //           }
    //           console.log("we in the post-save place world");
    //         });
    //     } else {
    //       resolve(place);
    //     }
    // });

}

async function saveImage(payload) {
  const {size, filename, filepath, mimetype} = payload;
  return await knex("images").insert({
    size, filename, filepath, mimetype
  });
}

async function saveItem(payload, placeID, imageID) {
  const {price, name, description } = payload;
  return await knex("items").insert({
    price,
    likes: 0,
    image_id: imageID,
    creator_id: payload
  });
}




module.exports = router;
