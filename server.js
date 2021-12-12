require("dotenv").config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
//websockets
const expressWs = require('express-ws');

const path = require('path');

const app = express();

//websockets
const wsInstance = expressWs(app);

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


// mongoose.connect(process.env.DB_URI || 'mongodb://localhost/fu5p_21221', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// mongoose.connection.on('connected', () => {
//   console.log('Mongoose is connected baby!');
// });

app.use(cors());
// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 

//multer stuph
if(process.env.NODE_ENV === "production") {
  // saveLoc = './client/build/'+imgLoc;
  // saveLoc = imgLoc;
  saveLoc = "./client/build";
  console.log("We are identifying production");
} else {
  saveLoc = './client/public/'+imgLoc;
  console.log("We are identifying development");
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

app.post('/api/v1/items/upload-image', upload.single('item_image'), (function(req, res, next) {
  console.log("we startin upload image");
  console.log("req.file", req.file);
  console.log("req.body", req.body);
  //we should only get the path AFTER whatever is static...
  payload = {
    path
  }
  var path = req.file.path;
 
  console.log("path",path);
  res.send(path);
}));

//websocket stuff...
//live commenting
app.ws('/', function(ws, req) {
  console.log('in /comment websocket here is ws and req');
  ws.on('message', function incoming(msg) {
    console.log('this is message in websocket', msg);
    ws.broadcast(msg);
  });

  ws.broadcast = function broadcast(data) {
    wsInstance.getWss().clients.forEach(function each(client) {
      console.log("client");
      client.send(data);
    })
  }
});

// //live liking
// app.ws('/like', function(ws, req) {
//   ws.on('message', function incoming(msg) {
//     console.log("coming from /like socket", msg);
//     //ws.broadcast(msg);
//   });

//   // ws.broadcast = function broadcast(data) {
//   //   wsInstance.getWss().clients.forEach(function each(client) {
//   //     client.send(data);
//   //   })
//   // }
// });

//Step 3
if (process.env.NODE_ENV === 'production') {
  console.log("We are identifying production");
  app.use(express.static('client/build'));
} 

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
