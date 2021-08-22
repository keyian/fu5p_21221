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
function handleMarkerClick() {
  console.log(props);
  //if already is center, then go to the item
  // if not center, then zoom in and center (via props.onclick)
  props.onClick({lat: props.lat, lng: props.lng}, props.item._id);
  //href={"#"+props.item._id} 
}
  return (
    <div className="marker">
        <a onClick={handleMarkerClick}><img className="marker" src={source} width="25" height="25" alt={props.item.name} /></a>
        {/* <a href={"#"+props.item._id} ><img className="marker" src={source} width="25" height="25" alt={props.item.name} /></a> */}
    </div>
  );
}

export default MapMarker;