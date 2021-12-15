import React, { useState } from 'react';
import './../App.css';
import GMapsAutoCompleteWrapper from './GMapsAutoCompleteWrapper.js';
import ItemFinder from '../apis/ItemFinder'; 
//componentz
import Draggable from 'react-draggable';
import Button from './Button.js';

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
    const [file] = e.target.files;
    let imgPrev =document.getElementById("img-prev");
    if (file) {
      imgPrev.src = URL.createObjectURL(file);
    }
    imgPrev.style.display = "inline";

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
      itemName,
      placeName,
      price,
      description,
      address,
      coordinates,
      google_place_id: placeId,
      user: userData,
      image_name: imageName
    };

    handleSubmitStartImgUpload(event, formData, payload);
  }

  const handleSubmitStartImgUpload = (e, formData, payload) => {
    //logging during submit, before handoff to API
    console.log("this is formdata", formData);

    //send formdata to image
    ItemFinder.post('/upload-image', formData)
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
    payload.imagePayload = response;
    uploadImgResponseCB(payload);
  };

  const uploadImgResponseCB = (payload) => {
    console.log("What is payload in uploadImgResponseCB???", payload);
    ItemFinder.post('/save-item', payload)
    .then((item)=> {
      console.log("here da item: ", item);
      props.addItem(item.data);
      clear();
    });  
  }

  return (
      <Draggable>

        <form method="POST" encType="multipart/form-data" onSubmit={prepareSubmit} id="addItemForm">
          <span id="drag-span">DRAG THIS</span>
          <input type="text" name="itemName" value={itemName || ''} onChange={e => setItemName(e.target.value)} placeholder="What's under $5?"/>
          <GMapsAutoCompleteWrapper hooks={{address, setAddress, setCoordinates, setPlaceName, setPlaceId}} />
            <div id="price-input-div"><span id="dollar-span">$</span><input type="text" id="price-input" name="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" /></div>
          <label>Image</label>
          <img id="img-prev" src="#" alt="your pic" />
            <input 
                type="file" 
                accept=".png, .jpg, .jpeg"
                name="item_image"
                id="itemImage"
                onChange={onChangeImage}
                placeholder="Image"
              />
            <textarea rows="4" cols="30" name="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..."/>
          <br />
          <Button id="itemform-button">SUBMIT</Button>
        </form>
      </Draggable>
    );
}