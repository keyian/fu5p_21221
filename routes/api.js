const express =  require('express');

const router = express.Router();

const Item = require('../models/item');

//Routes
router.get('/', (req, res) => {

  Item.find()
  .then((data) => {
    console.log('Data: ', data);
    res.json(data);
  })
  .catch((error) => {
    console.log('error: ', error)
  })
});

router.post('/save', (req, res) => {
  console.log("Body: ", req.body);
  const data = req.body;

  const newItem = new Item(data);

  // .save
  newItem.save((error) => {
    if(error) {
      res.status(500).json({ msg: 'Sorry, internal server errors' });
      return;
    } 
      // Item
    return res.json({
        msg: "Your data has been saved!!!!!"
    });
    
  });

  
});

router.get('/name', (req, res) => {
  const data = {
    username: 'peterson',
    age: 5
  };
  res.json(data);
});

module.exports = router;
