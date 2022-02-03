import React, { useEffect, useState } from 'react';
import  { useHistory } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker.js';
import './styles/ItemMap.css';
import Container from 'react-bootstrap/Container';

function ItemMap(props) {

  
  // eslint-disable-next-line
  const [center, setCenter] = useState({lat: 40.7128, lng: -74.0060});

    // eslint-disable-next-line
  const itemsies = props.items;
    // eslint-disable-next-line
  const [zoom, setZoom] = useState(11);
  //using "dictionary" to make sure state is tracked by google map
  const mapState = {center: center};
  const zoomState = {zoom: zoom};

  const history = useHistory();

  function handleMarkerClick(coords, itemID) {
    console.log("hit handlemarkerclick");
    let lat=coords.lat;
    let lng=coords.lng;
    //if we already have centered this marker, then take us to it...
    if(center.lat === lat && center.lng ===lng) {
      //either scroll into view in the item feed, or go to the item's page
      // document.getElementById(itemID)? document.getElementById(itemID).scrollIntoView(true) : history.push(`/item/${itemID}`);
      const SLUG_SPLIT = history.location.pathname.split("/");
      console.log("slug_split", SLUG_SPLIT);
      if(!SLUG_SPLIT.includes("item")) {
        history.push(`/item/${itemID}`)
      } 
      
    } else {
      setCenter(prevState => ({...prevState, lat: lat, lng: lng}));
      setZoom(15);
    }  
 }
 
 function isSingleItem() {
   if(itemsies.length === 1) {
     setCenter(prevState => ({...prevState, lat: itemsies[0].coordinates[0], lng:itemsies[0].coordinates[1]}));
     setZoom(15);
    }
  }

  function reCenter() {
    if(props.center?.length > 1) {
      setCenter(prevState => ({...prevState, lat: props.center[0], lng: props.center[1]}));
      setZoom(14);
    }
  }

  useEffect(isSingleItem, [itemsies]);

  useEffect(reCenter, [props.center]);

  const apiIsLoaded = (map, maps) => {
    map.setClickableIcons(false) // Need to call this to disable POIs
  }
 
//  return (itemsies.length > 0) ? (
 return (
      // Important! Always set the container height explicitly
      <Container className="map-div" id={props.id}>
            <GoogleMapReact
              center={mapState.center}
              zoom={zoomState.zoom}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({map, maps}) => apiIsLoaded(map, maps)}
            >
              {itemsies.map((item, index) =>
                <MapMarker key={index} onClick={handleMarkerClick} lat={item.coordinates[0]} lng={item.coordinates[1]} item={item}/>
              )}
            </GoogleMapReact>
       </Container>
 )
}

export default ItemMap;