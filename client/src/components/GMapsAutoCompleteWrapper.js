import React from 'react';
import './../App.css';
import PlacesAutoComplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";
import './styles/GMapsAutoCompleteWrapper.css';


function extractName(suggestion) {
    let breakup = suggestion.split(',');
    let name = breakup.shift();
    while(breakup.length > 4) {
        name += breakup.shift();
    }
    return name;
}

function GMapsAutoCompleteWrapper(props) {
    //sharing hooks parent to child...
    const {address, setAddress, coordinates, setCoordinates, placeName, setPlaceName, placeId, setPlaceId } = props.hooks;
    const handleSelect = async value => {
        const address_Results = await geocodeByAddress(value);
        const latLng = await getLatLng(address_Results[0]);
        const formatted_add = address_Results[0].formatted_address;
        setPlaceName(extractName(value));
        setAddress(formatted_add);
        setPlaceId(address_Results[0].place_id);
        setCoordinates(latLng);
        console.log(extractName(value));
    };

    const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div class="places-outer-div">
            <input {...getInputProps({ placeholder: "Where dat good shet?" })} />

            <div class="places-inner-div">
              {loading ? <div>...loading</div> : null}
              {suggestions.map(suggestion => {
                const style = {
                  backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                };

                return (
                  <div class="suggestions-div" {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        );

    return (
        <div>
      <PlacesAutoComplete 
      value={address} 
      onChange={setAddress} 
      onSelect={handleSelect}>
         {renderFunc}
       </PlacesAutoComplete>
       </div>
    );
}

export default GMapsAutoCompleteWrapper;