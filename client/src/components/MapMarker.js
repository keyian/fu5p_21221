import React from 'react';
import './../App.css';
//import anya from 'anya.png';
//remove the file root...
const FILE_ROOT = 'client/public';
const MapMarker = (props) => {
  let source = props.item.img.substring(FILE_ROOT.length);

  return (
    <div>
        <img src={source} width="25" alt={props.item.name} />
    </div>
  );
}

export default MapMarker;