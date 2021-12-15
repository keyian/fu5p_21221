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
    const response = await knex.select("*").from("items")
    .innerJoin('places', 'items.place_id', 'places.place_id')
    .innerJoin('images', 'items.image_id', 'images.image_id');
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

    res.status(200).json({
      status: "success",
      results: response.length,
      data: {
          itemComments
      }
    }) 

  } catch (err) {
    console.log("Error getting ONE item: ", err);
  }
  
})

router.get('/v1/users/populate-user-favorites', async (req, res) => {
  try {
    console.log("in populate user", req.query.userID);
    
    const userLikes = await knex.from("users")
      .innerJoin("item-likes", "users.user_id", "item-likes.user_id")
      .innerJoin("items", "item-likes.item_id", "items.item_id");
  
    res.send(userLikes);
  } catch (err) {
    console.log("Error populating user favorites: ", err);
  }
  
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
    coordinates: [data.coordinates.lat, data.coordinates.lng],
    items: [],
    google_place_id: data.google_place_id
  };

  console.log("here are placeFields", placeFields);


  const place = await createOrFindPlace(placeFields);
  console.log("this is place after insert: ", place);
  
  const item = saveItem(data, place.place_id, image.image_id, image.filepath);

  res.status(201).json({
    status: "success",
    results: response.length,
    data: {
        item
    }
  }) 

  } catch (err) {
    console.log("There was an error during Save Item...: ", err);
  } 
});

router.post('/v1/users/save-user', async (req, res) => {
  const data = req.body;
  try {
  console.log("we made it to try");
   let user = await knex("users").insert({
      name: data.name,
      picture: data.picture,
      facebook_id: data.fbid,
      email: data.email
    })
    .onConflict("facebook_id")
    .ignore().returning('*')
    .leftJoin('item_likes', 'users.user_id', 'item_likes.user_id');

    //until i can make this one query...
    if(!user.length) {
      console.log("in not user length");
      user = await knex.select('users.*', 'item_likes.item_id', 'item_likes.like_status')
      .from("users").where({facebook_id: data.fbid})
      .leftJoin('item_likes', 'users.facebook_id', 'item_likes.user_id');
      console.log(user);
    }
    console.log("here's user in save-user", user);
    res.status(201).json({
      status: "success",
    });
  } catch(err) {
    console.log(err);
  }

});


//helperzzz

async function createOrFindPlace(placeFields) {
  const { name, formatted_address, coordinates, google_place_id } = placeFields;
  try {


    let place = await knex("places").insert({
      name, formatted_address, coordinates, google_place_id
    })
      .onConflict("google_place_id")
      .ignore().union(function() {
        this.from("places").where({google_place_id: google_place_id});
      }).returning('*');

      //for now, going to do multiple queries if thing is found
      if(!place.length) {
        place =  await knex.select('place_id').from("places").where({google_place_id: placeFields.google_place_id});
      }
    
      return place[0];
  } catch (err) {
    console.log("Error creating or finding place: ", err);
  }
  

}

async function saveImage(payload) {
  const {size, filename, filepath, mimetype} = payload.data;
  const image = await knex("images").insert({
    size, filename, filepath, mimetype
  }).returning('*');

  return image[0];
}

async function saveItem(payload, placeID, imageID) {
  console.log("this is payload in save item", payload);
  console.log("this is place id, imageid", placeID, imageID);
  const {price, description} = payload;

  const itemImagePlace = knex.with('inserted_item', (qb)=> {
    qb.insert({
      name: payload.itemName,
      creator_id: payload.user.fbid,
      price,
      place_id: placeID,
      likes: 0,
      image_id: imageID,
      description
    }).into('items').returning('*')
  }).innerJoin('images', 'inserted_item.image_id', 'images.image_id')
  .innerJoin('places', 'inserted_item.place_id', 'places.place_id');
  
  console.log(itemImagePlace);

  //12-14-21 uncomment below if desirable

//   return await knex("items").insert({
//     name: payload.itemName,
//     creator_id: payload.user.fbid,
//     price,
//     place_id: placeID,
//     likes: 0,
//     image_id: imageID,
//     description
//   }).returning('*');
}




module.exports = router;
