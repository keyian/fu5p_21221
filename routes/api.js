const e = require('express');
const express =  require('express');
const router = express.Router();
const knex = require('../knex/knex.js');
const authorize = require("../middleware/authorize");

const imgLoc = 'images/uploads';


//Routes

router.post("/v1/comments/add-comment", async (req, res) => {
  const {item_id, comment_text, user_id, user_name} = req.body;
  try {
    const comment = await knex("comments").insert({
      item_id, comment_text, user_id, user_name
    }).returning('*');
    
    console.log("comment is", comment);
    res.status(201).json({
      status: "success",
      comment: comment[0]
    });
  } catch (err) {
    console.log("error adding comment: ", err);
  }
  
})

router.post('/v1/likes/like-click', async (req, res) => {
  let { userID, itemID, liked, disliked, oldLiked, oldDisliked } = req.body;
  let likeChange = 0;
  try {
    if(liked) {
      if(oldDisliked) {
        //2 point swing--was disliked, now is liked
        await knex('items')
        .where('item_id', '=', itemID)
        .increment('likes', 2);
        likeChange = 2;

        //update item_like
        await knex('item_likes').where({
          item_id: itemID,
          user_id: userID
        }).update('like_status', true);

      } else {
        //+1--was nothing, now liked
        await knex('items')
        .where('item_id', '=', itemID)
        .increment('likes', 1);
        likeChange = 1;

        //create item_like
        await knex('item_likes').insert({
          item_id: itemID,
          user_id: userID,
          like_status: true
        });
      }

    } else if (disliked) {
      if(oldLiked) {
        //2 point swing--was liked, now is disliked
        await knex('items')
        .where('item_id', '=', itemID)
        .decrement('likes', 2);
        likeChange = -2;

        //update item_like
        await knex('item_likes').where({
          item_id: itemID,
          user_id: userID
        }).update('like_status', false);

      } else {
        //-1--was nothing, now disliked
        await knex('items')
        .where('item_id', '=', itemID)
        .decrement('likes', 1);
        likeChange = -1;

        //create item_like
        await knex('item_likes').insert({
          item_id: itemID,
          user_id: userID,
          like_status: false
        });
      }
      
    } else {
      await knex('item_likes').where({
        user_id: userID,
        item_id: itemID
      }).del();
      
      oldLiked ?
      (likeChange = -1 &&  
      await knex('items')
        .where('item_id', '=', itemID)
        .decrement('likes', 1))
        
      :

      (likeChange = 1 && await knex('items')
        .where('item_id', '=', itemID)
        .increment('likes', 1))

    }

    res.status(201).json({
      itemID,
      likeChange: likeChange
    });

  } catch(err) {
    console.log("Error updating item and item likes: ", err);
  }

});

router.get('/v1/comments/get-comments/:id', async (req, res) => {

  try {
    let itemID = req.params.id;
    console.log("itemID", itemID);
    const comments = await knex('comments').where({item_id: itemID});
    if(!comments) {
      console.log("no comments");
    } else {
      res.send(comments);
    }
  } catch(err) {
    console.log("Error getting comments: ", err);
  }
  
    
  });


router.get('/v1/items/get-items', async (req, res) => {
  try {
    const response = await knex.select("*").from("items")
    .innerJoin('places', 'items.place_id', 'places.place_id')
    .innerJoin('images', 'items.image_id', 'images.image_id')
    .innerJoin('users', 'items.creator_id', 'users.user_id')
    .orderBy('created_at', 'desc');
    // console.log("response is...", response);
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

router.get('/v1/items/get-one-item/:id', async (req, res) => {
  try {
    // const item  = await knex.select('*')
    // .from('items')
    // .where({item_id: req.query.itemID});


    const itemPlaceComments =  await knex.raw(`
    select i.*, c.comment_text, c.user_name, c.user_id, p.place_name, p.coordinates, img.s3_url, u.name, u.email
    from (select * from items where item_id = ${req.params.id}) i 
    left join comments c on i.item_id = c.item_id 
    left join places p on i.place_id = p.place_id
    left join images img on i.image_id = img.image_id
    left join users u on i.creator_id = u.user_id`);

    res.status(200).json({
      status: "success",
      results: itemPlaceComments.rows[0]
    }); 

  } catch (err) {
    console.log("Error getting ONE item: ", err);
  }
  
})

//return user with favorites... 
//if no favorites, then just return user.

router.get('/v1/users/populate-user-favorites/:userID', async (req, res) => {
  try {
    console.log("in populate user", req.params.userID);
    
    let userLikes = await knex.select('il.*', 'i.*', 'p.*', 'img.*', 'creator.name AS name', 'creator.user_id AS creator_user_id', 'user.name AS user_name')
    .from('item_likes AS il').where('il.user_id', req.params.userID)
      .innerJoin("items AS i", "il.item_id", "i.item_id")
      .innerJoin('places AS p', 'i.place_id', 'p.place_id')
      .innerJoin('images AS img', 'i.image_id', 'img.image_id')
      .innerJoin('users AS creator', 'i.creator_id', 'creator.user_id')
      .leftJoin('users AS user', 'il.user_id', 'user.user_id')
      .orderBy('created_at', 'desc');
    if(userLikes.length === 0) {
      console.log("In no likes section");
      userLikes = await knex.from("users").where('user_id', req.params.userID);
    }
    res.status(200).json({userLikes});
  } catch (err) {
    console.log("Error populating user favorites: ", err);
  }
  
});

//save each part of an item: image, place, and finally item. return cumulative object
router.post('/v1/items/save-item', async (req, res) => {
  try { 
  let data = req.body;
  console.log("data in save-item: ", data);

  const image = await saveImage(data.imagePayload);
  console.log("this is returned image after insert...", image);
  //does place exist?
  let placeFields = {
    place_name: data.placeName,
    formatted_address: data.address,
    coordinates: [data.coordinates.lat, data.coordinates.lng],
    items: [],
    google_place_id: data.google_place_id
  };

  console.log("here are placeFields", placeFields);


  const place = await savePlace(placeFields);
  console.log("this is place after insert: ", place);
  
  const item = await saveItem(data, place.place_id, image.image_id, image.filepath);

  saveItemLike(item.item_id, data.user.user_id);

  res.status(201).json({
    status: "success",
    item
  }) 

  } catch (err) {
    console.log("There was an error during Save Item...: ", err);
  } 
});

router.put('/v1/items/edit-item/:id', async (req, res) => {
  //for now, you can't edit PLACE or IMAGE
  const item_id = req.params.id;
  console.log("edit item this is req.body", req.body);
  const {item_name, price, description} = req.body;
  try {
    const item = await knex("items")
    .where({item_id})
    .update({
      item_name, price, description
    }).returning('*');

    res.status(200).json({item});
  } catch(err) {
    console.log("error editing item...", err);
  }
})

router.delete('/v1/items/delete-item/:id', async (req, res) => {
  try {
    console.log(req.params.id);
//callback should remove item from item list and also redirect to home if its on item page
    const deleted = await knex("items").where({item_id: req.params.id}).del(['*']);
    console.log("this is deleted", deleted);
    res.status(204).json({
      status: "success"
    })
  } catch(err) {
    console.log("Error deleting item...", err);
  }
})

router.post('/v1/users/get-user', authorize, async (req, res) => {
  console.log("get to server-side get user?");
  try{
    const userID = req.user.id;
    console.log("this is req.header", userID);
    const user = await knex("users").where({'users.user_id': userID})
        .leftJoin('item_likes', 'users.user_id', 'item_likes.user_id')
        .select('users.email', 'users.name', 'users.user_id', 'item_likes.item_id', 'item_likes.like_status');
    
    console.log("in get user")

    res.status(201).json({
      status: "success", user
    });

  } catch(err) {

    console.log("Error getting user: ", err)
  }
})

//save a user or select a user and return the row
router.post('/v1/users/save-user', async (req, res) => {
  const data = req.body;
  try {
   let user = await knex("users").insert({
      name: data.name,
      picture: data.picture,
      user_id: data.userID,
      email: data.email
    })
    .onConflict("user_id")
    .ignore().returning('*')
    // .leftJoin('item_likes', 'users.user_id', 'item_likes.user_id');

    //until i can make this one query...
    if(!user.length) {
      user = await knex.select('users.*', 'item_likes.item_id', 'item_likes.like_status')
      .from("users").where({user_id: data.userID})
      .leftJoin('item_likes', 'users.user_id', 'item_likes.user_id');
    }

    console.log("here's user in save-user", user);
    res.status(201).json({
      status: "success", user
    });
  } catch(err) {
    console.log(err);
  }

});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"))
})


//helperzzz
//save place or select it and return the row
async function savePlace(placeFields) {
  const { place_name, formatted_address, coordinates, google_place_id } = placeFields;
  try {


    let place = await knex("places").insert({
      place_name, formatted_address, coordinates, google_place_id
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

//save image and return its info
async function saveImage(payload) {
  const {size, filename, filepath, mimetype, s3_url} = payload;
  const image = await knex("images").insert({
    size, filename, filepath, mimetype, s3_url
  }).returning('*');

  return image[0];
}

//save an item and return the row
async function saveItem(payload, placeID, imageID) {
  console.log("in save item");
  const {price, description} = payload;


  const itemImagePlace = await knex.with('inserted_item', 
  (qb) => {
    qb.returning('*')
    .insert({
      item_name: payload.itemName,
      creator_id: payload.user.user_id,
      price,
      place_id: placeID,
      likes: 1,
      image_id: imageID,
      description
    })
    .into('items')})
  .select('*')
    .from('inserted_item')
  .innerJoin('images', 'inserted_item.image_id', 'images.image_id')
  .innerJoin('places', 'inserted_item.place_id', 'places.place_id');


  console.log(itemImagePlace);
  return itemImagePlace[0];
  
}

async function saveItemLike(itemID, userID) {
  try{
    await knex('item_likes').insert(
      {item_id: itemID,
      user_id: userID,
    like_status: true});
  } catch (err) {
    console.log("error saving item's LIKE", err);
  }

}



module.exports = router;
