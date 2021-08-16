import React from 'react';
//css
import './styles/MapMarker.css';
//import anya from 'anya.png';
//remove the file root...
const FILE_ROOT = '/client/public';
const MapMarker = (props) => {
  let source = props.item.img.substring(FILE_ROOT.length);

  return (
    <div className="marker">
        <img className="marker" src={source} width="25" height="25" alt={props.item.name} />
    </div>
  );
}

export default MapMarker;