export function updateLikes(oldLiked, oldDisliked, action, userData, setUserData, itemID) {
    //remove from liked
    console.log("in update likes, item id ", itemID);

    if(oldLiked) {
        if(action === "dislike") {
            setUserData(userData => ({...userData, itemDislikes: userData.itemDislikes.concat(itemID)}))
        }
        let nuItemLikes = userData.itemLikes;
        console.log("nuItemLikes", nuItemLikes);
        nuItemLikes.splice(userData.itemLikes.indexOf(itemID), 1);
        console.log("nuItemLikes post splice", nuItemLikes);
        setUserData(userData => ({...userData, itemLikes: [...nuItemLikes]}))
    } else if (oldDisliked) {
        if(action === "like") {
            setUserData(userData => ({...userData, itemLikes: userData.itemLikes.concat(itemID)}))
        } 

        let nuItemDislikes = userData.itemDislikes;
        nuItemDislikes.splice(userData.itemDislikes.indexOf(itemID), 1);
        setUserData(userData => ({...userData, itemDislikes: [...nuItemDislikes]}))
    } else {
        action === "like" ?
            setUserData(userData => ({...userData, itemLikes: userData.itemLikes.concat(itemID)}))
            :
            setUserData(userData => ({...userData, itemDislikes: userData.itemDislikes.concat(itemID)}))
            ;
    }

    //add to liked
        //remove from disliked
    //remove from liked
    //add to disliked
        //remove from liked
    //remove from disliked
};