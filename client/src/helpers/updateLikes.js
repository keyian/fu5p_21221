export default function updateLikes(oldLiked, oldDisliked, action, setUserData, itemID) {
    //remove from liked
    if(oldLiked) {
        if(action === "dislike") {
            setUserData(userData => ({...userData, itemDislikes: userData.itemDislikes.concat(itemID)}))
        } 
        setUserData(userData => ({...userData, itemLikes: [...userData.itemLikes, userData.itemLikes.splice(userData.itemLikes.indexOf(itemID))]}))
    } else if (oldDisliked) {
        if(action === "like") {
            setUserData(userData => ({...userData, itemLikes: userData.itemLikes.concat(itemID)}))
        } 
        setUserData(userData => ({...userData, itemDislikes: [...userData.itemDislikes, userData.itemDislikes.splice(userData.itemDislikes.indexOf(itemID))]}))
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