const manicureUserData = async (user) => {
    let finalUser = {email: user[0].email, user_id: user[0].user_id, name: user[0].name, itemLikes: [], itemDislikes: []};

    user.forEach((itemLike, index) => {
      if(itemLike.item_id){
        (itemLike.like_status > 0) ?
          finalUser.itemLikes.push(itemLike.item_id) :
          finalUser.itemDislikes.push(itemLike.item_id);
      }
    });

    return finalUser;
  }

export default manicureUserData;

