import React, { useState } from 'react';
import './../App.css';
import Button from './Button.js';
import GMapsAutoCompleteWrapper from './GMapsAutoCompleteWrapper.js';
import axios from 'axios';
//css
import './styles/ItemForm.css';


export default function ItemForm(props) {
  const [itemName, setItemName] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageName, setImageName] = useState("");
  const userData = props.userData;
  //try passing the GMapsAutoCompleteWrapper (object) hook from above...
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
      lat: null,
      lng: null
  });
  const [placeId, setPlaceId] = useState("");
  const [item, setItem] = useState({});
  /*
  * Clears the form, called after submit has been processed. 
  * UPDATE with other form fields as added, since they will also need to be cleared.
  */
  const clear = () => {
    setItemName('');
    setPlaceName('');
    setPrice(0);
    setDescription('');
    setAddress('');
    setCoordinates({lat: null, lng: null});
    setPlaceId('');
    document.getElementById("itemImage").value = "";

  }

  const onChangeImage = (e) => {
    if(e.target.value.length > 0) {
      setImageName(e.target.files[0]);
    }
    console.log('in handle photo, image name: ',imageName);
  }


  
  const prepareSubmit = (event) => {
    //start of exp
  
    //logging
    console.log("in handlesubmit");
    console.log("event.target", event.target);
    
    event.preventDefault();
    
    //formdata
    let daForm = document.getElementById('addItemForm');
    let formData = new FormData(daForm);
    console.log('initial formdata;', formData);
    const payload = {
      itemName: itemName,
      placeName: placeName,
      price: price,
      description: description,
      address: address,
      coordinates: coordinates,
      placeId: placeId,
      user: userData,
      imageName: imageName
    };

    handleSubmitStartImgUpload(event, formData, payload);
  }

  const handleSubmitStartImgUpload = (e, formData, payload) => {
    //logging during submit, before handoff to API
    console.log("this is formdata", formData);

    //send formdata to image
    axios.post('/api/uploadImage', formData)
      .then((response) => {uploadImgInitialCB(response, payload)})
      .catch((error) => {console.log("Error: ", error)});
    //send to API
  
  };

  const uploadImgInitialCB = (response, payload) => {
    console.log("reaching uploadimginiialcb here is payload: ", payload);
    if(response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      return;
    }
    // Examine the text in the response
    console.log("this is respose in uploadimginitialcb", response);
    payload.localImageLoc = response.data;
    uploadImgResponseCB(payload);
  };

  const uploadImgResponseCB = (payload) => {
    console.log("What is payload in uploadImgResponseCB???", payload);
    axios.post('/api/saveItem', payload)
    .then((item)=> {
      console.log("here da item: ", item);
      props.addItem(item.data);
      clear();
    });
  }

  return (
      <form method="POST" encType="multipart/form-data" onSubmit={prepareSubmit} id="addItemForm">
        <label>What's under $5?</label>
        <input type="text" name="itemName" value={itemName} onChange={e => setItemName(e.target.value)} />
        <GMapsAutoCompleteWrapper hooks={{address, setAddress, coordinates, setCoordinates, placeName, setPlaceName, placeId, setPlaceId}} />
        <label>Price</label>
          <input type="text" name="price" value={price} onChange={e => setPrice(e.target.value)} />
        <label>Image</label>
          <input 
                type="file" 
                accept=".png, .jpg, .jpeg"
                name="item_image"
                id="itemImage"
                onChange={onChangeImage}
            />
        <label>Description/Any comments?</label>
          <textarea rows="4" cols="30" name="description" value={description} onChange={e => setDescription(e.target.value)} />
        <br />
        <Button id="itemform-button">SUBMIT</Button>
      </form>
    );
}