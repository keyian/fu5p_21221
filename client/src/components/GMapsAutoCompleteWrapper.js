import React from 'react';
import './../App.css';
import PlacesAutoComplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";

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
    const {address, setAddress, coordinates, setCoordinates, placeName, setPlaceName } = props.hooks;
    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        const formatted_add = results[0].formatted_address;
        setPlaceName(extractName(value));
        setAddress(formatted_add);
        setCoordinates(latLng);
        console.log(extractName(value));
    };

    const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input {...getInputProps({ placeholder: "Where?" })} />

            <div>
              {loading ? <div>...loading</div> : null}
              {suggestions.map(suggestion => {
                const style = {
                  backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
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