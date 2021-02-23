import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class ItemMap extends Component {
  static defaultProps = {
    center: {
      lat: 40.7128,
      lng: -74.0060
    },
    zoom: 11
  };
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GMAPS_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
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
}

export default ItemMap;