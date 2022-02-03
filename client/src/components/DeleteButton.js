import React from "react";
import Button from "./Button";
import ItemFinder from "../apis/ItemFinder";

const DeleteButton = (props) => {
    const item = props.item;
    const handleClick = async (e) => {
        try {
            e.preventDefault();

            await ItemFinder.delete(`/delete-item/${item.item_id}`);
            props.del(item.item_id);
        } catch(err) {
            console.log("Error deleting item...", err);
        }
    }

    return(
        <Button className={props.className} onClick={handleClick}>
            DELETE
        </Button>
    );
}

export default DeleteButton;