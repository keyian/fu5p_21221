import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker.js';
import './styles/ItemMap.css';

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
  return (itemsies!==undefined) ? (
      // Important! Always set the container height explicitly
      <div id="map-div" >
        <GoogleMapReact
          defaultCenter={center}
          defaultZoom={zoom}
        >
        {itemsies.map((item, index) =>
          <MapMarker lat={item.place.coordinates.lat} lng={item.place.coordinates.lng} item={item}/>
        )}
        {/* <MapMarker lat={40.7128} lng={-74.0060} /> */}
        </GoogleMapReact>
      </div>
    ) : (<p>Loading...</p>);
}

export default ItemMap;