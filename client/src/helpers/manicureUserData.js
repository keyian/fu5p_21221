const manicureUserData = (user) => {
    let finalUser = {email: user[0].email, user_id: user[0].user_id, name: user[0].name, admin: user[0].admin, itemLikes: [], itemDislikes: []};

    user.forEach((itemLike, index) => {
      if(itemLike.item_id){
        (itemLike.like_status) ?
          finalUser.itemLikes.push(itemLike.item_id) :
          finalUser.itemDislikes.push(itemLike.item_id);
      }
    });

    return finalUser;
  }

export default manicureUserData;

