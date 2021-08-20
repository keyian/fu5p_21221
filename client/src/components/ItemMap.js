import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker.js';
import './styles/ItemMap.css';
import Button from './Button.js';

function ItemMap(props) {

  
  // eslint-disable-next-line
  const [center, setCenter] = useState({
        lat: 40.7128,
        lng: -74.0060
  });
    // eslint-disable-next-line
  const [itemsies, setItemsies] = [props.items, props.setItems];
    // eslint-disable-next-line
  const [zoom, setZoom] = useState(11);

  function handleMarkerClick() {

    console.log("hit handlemarkerclick");
    let nuCenter = center;
    // nuCenter.lat = coordinates.lat;
    // nuCenter.lng = coordinates.lng;
    nuCenter.lat=20;
    nuCenter.lng=30;
    console.log(nuCenter);
    setCenter(nuCenter);
  }
  return (itemsies!==undefined) ? (
      // Important! Always set the container height explicitly
      <div id="map-div" >
        <GoogleMapReact
          center={center}
          zoom={zoom}
        >
        {itemsies.map((item, index) =>
          <MapMarker lat={item.place.coordinates.lat} lng={item.place.coordinates.lng} item={item}/>
        )}
        {/* <MapMarker lat={40.7128} lng={-74.0060} /> */}
        </GoogleMapReact>
      
      <Button onClick={handleMarkerClick}>ey </Button>;
      </div>
    ) : (<p>Loading...</p>);
}

export default ItemMap;