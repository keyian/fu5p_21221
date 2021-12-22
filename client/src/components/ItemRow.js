import React from 'react';

export default function ItemRow(props) {
    // props
    const item = props.item;



    return(
        <tr>
            <th>{props.dataRef}</th>
            <td>{item.item_name}</td>
            <td>{item.price}</td>
            <td>{item.place_name}</td>
            <td>{item.likes}</td>
        </tr>
    );
}