import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Likes from './Likes';

export default function NuListRow(props) {
    // props
    const item = props.item;

    let FILE_ROOT = '/client/public';

    if(process.env.NODE_ENV === 'production') {
        FILE_ROOT = '/client/build';
    } 

    return(
        <ListGroup.Item>
            <Image className="col-sm" src={item.filepath.substring(FILE_ROOT.length)} rounded thumbnail width="100px"/>
            <p className="col-sm">test {item.item_name}</p>
            <Likes className="col-sm" item={item} socket={props.socket}/>
        </ListGroup.Item> 
    );
}