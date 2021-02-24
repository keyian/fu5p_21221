import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function ItemMap() {
  useEffect(() => {

  });

  const [center, setCenter] = useState({
        lat: 40.7128,
        lng: -74.0060
  });

  const [zoom, setZoom] = useState(11);

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GMAPS_KEY }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <AnyReactComponent
            lat={40.7128}
            lng={-74.0060}
            text="Keyian is Gay"
          />
        </GoogleMapReact>
      </div>
    );
}

export default ItemMap;