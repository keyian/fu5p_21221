import React from 'react';
//css
import './styles/MapMarker.css';
//import anya from 'anya.png';
//remove the file root...

const MapMarker = (props) => {
  let source = props.item.s3_url;

  function handleMarkerClick(e) {
    e.preventDefault();
    //if already is center, then go to the item
    // if not center, then zoom in and center (via props.onclick)
    props.onClick({lat: props.lat, lng: props.lng}, props.item.item_id);
  }

  return (
    <div className="marker">
        <button className="no-dec-button marker-button" onClick={handleMarkerClick}><img className="marker" src={source} width="25" height="25" alt={props.item.item_name} /></button>
    </div>
  );
}

export default MapMarker;