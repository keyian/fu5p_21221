const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const HTTPS = process.env.HTTPS || true;

const routes = require('./routes/api.js');

// multer
const multer = require('multer');
const imgLoc = "images/uploads";
var mimeToExt = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png"
}


mongoose.connect(process.env.DB_URI || 'mongodb://localhost/fu5p_21221', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected baby!');
});

// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 

//multer stuph
if(process.env.NODE_ENV === "PRODUCTION") {
  saveLoc = './client/build/'+imgLoc;
} else {
  saveLoc = './client/public/'+imgLoc;
}
var storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, saveLoc)
  },
  filename: function (req, file, cb) {
    var ext = "." + mimeToExt[file.mimetype];
    cb(null, file.fieldname + '-' + Date.now()+ext);
  }
});

var upload  = multer({storage: storage});


//HTTP Request Logger
app.use(morgan('tiny'));
app.use('/api', routes);

app.post('/api/uploadImage', upload.single('item_image'), (function(req, res, next) {
  console.log("we startin upload image");
  console.log("req.file", req.file);
  console.log("req.body", req.body);
  //we should only get the path AFTER whatever is static...
  var path = req.file.path;
 
  console.log("path",path);
  res.send(path);
}));

//Step 3
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
} 

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
