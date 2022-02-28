//react
import React, { useContext, useState } from 'react';

//styling
import './../App.css';
import './styles/ItemForm.css';
import {BsCardImage, BsUpload} from 'react-icons/bs';

//api
import ItemFinder from '../apis/ItemFinder'; 

//componentz
import Draggable from 'react-draggable';
import Button from './Button.js';
import GMapsAutoCompleteWrapper from './GMapsAutoCompleteWrapper.js';

//context
import { AppContext } from '../context/AppContext';

//react-bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

import itemFormValidator from '../helpers/itemFormValidator';

export default function ItemForm(props) {
  //state
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
      lat: null,
      lng: null
  });
  const [description, setDescription] = useState("");
  const [imageName, setImageName] = useState("");
  const [itemName, setItemName] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [price, setPrice] = useState(0);
  const [validated, setValidated] = useState(false)

  //context
  const {userData} = useContext(AppContext);


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
    clearImgPrev();
    document.getElementById("itemImage").value = "";
  }

  /**
   * image input event handler
   * @param {*} e 
   */
  const onChangeImage = (e) => {
    //set image name to that of the uploaded file
    if(e.target.value.length > 0) {
      setImageName(e.target.files[0]);
    }
  
    //get image preview element, and fill adjacent position with chosen image.
    const [file] = e.target.files;
    let imgPrev =document.getElementById("img-prev");
    if (file) {
      imgPrev.src = URL.createObjectURL(file);
    }
    imgPrev.style.display = "inline";
  }

  /**
   * Clears image preview using clunky process of deleting and re-creating it.
   */
  const clearImgPrev = () => {
  
    let imgPrev =document.getElementById("img-prev");
    let parent = imgPrev.parentNode;
    parent.removeChild(imgPrev);
    console.log(parent);

    let nuImg = document.createElement("img");
    nuImg.src = '#';
    nuImg.alt = "your img";
    nuImg.id = "img-prev";
    let imgInput = document.getElementById("itemImage");
    parent.insertBefore(nuImg, imgInput);

  }


      /**
     * Submit handler for the form. 
     * 1. Copy all of the formdata, and clear the form. Then it can't be double-clicked...
     * 3. 
     */
  const prepareSubmit = (event) => {
    event.preventDefault();
  
    //record formdata
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
    };

    clear();
    
    //formdata and payload should go through to validation
    handleSubmitStartImgUpload(event, formData, payload);
  }

  const handleSubmitStartImgUpload = (e, formData, payload) => {
    //logging during submit, before handoff to API
    console.log("this is formdata", formData);

    //send formdata to image
    ItemFinder.post('/upload-image', formData)
      .then((response) => {uploadImgInitialCB(response, payload)})
      .catch((error) => {console.log("Error: ", error)});
  
  };

  /**
   * Callback after image is uploaded. 
   * 
   */
  const uploadImgInitialCB = (response, payload) => {
    console.log("reaching uploadimginiialcb here is payload: ", payload);
    if(response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      return;
    }
    // Examine the text in the response
    console.log("this is respose in uploadimginitialcb", response);
    payload.imagePayload = response.data;
    uploadImgResponseCB(payload);
  };

  const uploadImgResponseCB = (payload) => {
    console.log("What is payload in uploadImgResponseCB???", payload);
    ItemFinder.post('/save-item', payload)
    .then((item)=> {
      console.log("here da item: ", item);
      props.addItem(item.data.item);
    });  
  }

  return (
      <Draggable cancel="input, .suggestions-div, textarea, button, label">
       <Form validated={validated} method="POST" encType="multipart/form-data" onSubmit={prepareSubmit} id="addItemForm">
          <Row><span id="drag-span">DRAG THIS</span></Row>
          <Row className="row-with-space">
            <Form.Group as={Col} xs={12} md={6} controlId="validationCustom01"> 
              <Form.Control required
               type="text" name="itemName" value={itemName} 
               onChange={e => setItemName(e.target.value)} 
               placeholder="Whuss the thing?"/>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} xs={12} md={6} controlId="validationCustom02">
              <GMapsAutoCompleteWrapper hooks={{address, setAddress, setCoordinates, setPlaceName, setPlaceId}} />
            </Form.Group>
          </Row>
          <Row className="row-with-space">
            <Form.Group as={Col} className="my-auto" xs={12} md={6}>
              <Form.Label><span id="dollar-span">$</span></Form.Label>
              <Form.Control required
                type="number" id="price-input" name="price" value={price} 
                onChange={e => setPrice(e.target.value)} 
                placeholder="Price" />
            </Form.Group>

            <Form.Group as={Col} className="my-auto" xs={12} md={6}>
              <Form.Label id="img-label" htmlFor="itemImage">
                <BsUpload color="black"/>&nbsp;Add an Image&nbsp;<BsCardImage color="black"/>
              </Form.Label>
              <Image thumbnail id="img-prev" src="#" alt="your pic" />
              <Form.Control required
                type="file" 
                accept=".png, .jpg, .jpeg"
                name="item_image"
                id="itemImage"
                onChange={onChangeImage}
                placeholder="Image" 
                  />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Control required
                as="textarea" 
                id="form-textarea" name="description" value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Notes..."/>
            </Form.Group>
          </Row>
          <Button className="fu5p-button">SUBMIT</Button>
        </Form>
      </Draggable>
    );
}