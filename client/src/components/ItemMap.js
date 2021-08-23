import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker.js';
import './styles/ItemMap.css';

function ItemMap(props) {

  
  // eslint-disable-next-line
  const [center, setCenter] = useState({lat: 40.7128, lng: -74.0060});

    // eslint-disable-next-line
  const [itemsies, setItemsies] = [props.items, props.setItems];
    // eslint-disable-next-line
  const [zoom, setZoom] = useState(11);
  //using "dictionary" to make sure state is tracked by google map
  const mapState = {center: center};
  const zoomState = {zoom: zoom};

  function handleMarkerClick(coords, itemID) {
    console.log("hit handlemarkerclick");
    let lat=coords.lat;
    let lng=coords.lng;
    //if we already have centered this marker, then take us to it...
    if(center.lat === lat && center.lng ===lng) {
      document.getElementById(itemID).scrollIntoView(true);
    } else {
      setCenter(prevState => ({...prevState, lat: lat, lng: lng}));
      setZoom(15);
    }  
 }
  return (itemsies!==undefined) ? (
      // Important! Always set the container height explicitly
      <div id="map-div" >
        <GoogleMapReact
          center={mapState.center}
          zoom={zoomState.zoom}
        >
        {itemsies.map((item, index) =>
          <MapMarker key={index} onClick={handleMarkerClick} lat={item.place.coordinates.lat} lng={item.place.coordinates.lng} item={item}/>
        )}
        {/* <MapMarker lat={40.7128} lng={-74.0060} /> */}
        </GoogleMapReact>
       </div>
    ) : (<p>Loading...</p>);
}

export default ItemMap;