import React from 'react';
//css
import './styles/MapMarker.css';
//import anya from 'anya.png';
//remove the file root...
let FILE_ROOT = '/client/public';
if(process.env.NODE_ENV === 'production') {
  FILE_ROOT = '/client/build';
} 

const MapMarker = (props) => {
let source = props.item.img.substring(FILE_ROOT.length);

  return (
    <div className="marker">
        <a href={"#"+props.item._id} ><img className="marker" src={source} width="25" height="25" alt={props.item.name} /></a>
    </div>
  );
}

export default MapMarker;