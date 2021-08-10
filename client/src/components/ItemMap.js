import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker.js';
import './styles/ItemMap.css';

function ItemMap(props) {
  const [center, setCenter] = useState({
        lat: 40.7128,
        lng: -74.0060
  });
  const [itemsies, setItemsies] = [props.items, props.setItems];
  const [zoom, setZoom] = useState(11);
  return (itemsies!==undefined) ? (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          defaultCenter={center}
          defaultZoom={zoom}
        >
        {itemsies.map((item, index) =>
          <MapMarker lat={item.place.coordinates.lat} lng={item.place.coordinates.lng} />
        )}
        {/* <MapMarker lat={40.7128} lng={-74.0060} /> */}
        </GoogleMapReact>
      </div>
    ) : (<p>Loading...</p>);
}

export default ItemMap;