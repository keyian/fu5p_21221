const express =  require('express');

const router = express.Router();

const BlogPost = require('../models/blogPost');

//Routes
router.get('/', (req, res) => {

  BlogPost.find()
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

  const newBlogPost = new BlogPost(data);

  // .save
  newBlogPost.save((error) => {
    if(error) {
      res.status(500).json({ msg: 'Sorry, internal server errors' });
      return;
    } 
      // BlogPost
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
