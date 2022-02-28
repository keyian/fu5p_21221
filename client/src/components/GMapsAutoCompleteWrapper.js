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
    const {address, setAddress, setCoordinates, setPlaceName, setPlaceId } = props.hooks;
    const handleSelect = async value => {
        const address_Results = await geocodeByAddress(value);
        const latLng = await getLatLng(address_Results[0]);
        const formatted_add = address_Results[0].formatted_address;
        setPlaceName(extractName(value));
        setAddress(formatted_add);
        setPlaceId(address_Results[0].place_id);
        setCoordinates(latLng);
    };

    const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="places-outer-div">
            <input required {...getInputProps({ placeholder: "Where?" })} />

            <div className="places-inner-div">
              {loading ? <div>...loading</div> : null}
              {suggestions.map(suggestion => {
                const style = {
                  backgroundColor: suggestion.active ? "#152BFF" : "#fff"
                };

                return (
                  <div className="suggestions-div" {...getSuggestionItemProps(suggestion, { style })}>
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
        onSelect={handleSelect} >
          {renderFunc}
        </PlacesAutoComplete>
      </div>
    );
}

export default GMapsAutoCompleteWrapper;