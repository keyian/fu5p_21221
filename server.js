require("dotenv").config();

const express = require('express');
const app = express();


const cors = require('cors');
const morgan = require('morgan');


const PORT = process.env.PORT || 8080;
console.log("LOGGING PORT", PORT);

console.log("this is process.env.PGUSER", process.env.PGUSER);

const routes = require('./routes/api.js');
const authRoutes = require('./routes/jwtAuth.js');
// multer
const multer = require('multer');
const imgLoc = "images/uploads";
var mimeToExt = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png"
}

//cross-origin resource sharing
app.use(cors());
// for parsing application as json
app.use(express.json()); 
// for parsing application/xwww-
app.use(express.urlencoded({ extended: true })); 

//all multer image upload stuph

const {
  singlePublicFileUpload
} = require("./awsS3");

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


/*
******SOCKET.IO********
*/
//socket
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = new Server(server);

const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  //disconnect log
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  //give comment to everyone
  socket.on('client-new-comment', (comment) => {
    socket.broadcast.emit(`server-new-comment-${comment.item_id}`, comment);
  })

  socket.on('client-new-like', (like) => {
    console.log("receiving client new like", like);
    socket.broadcast.emit(`server-new-like-${like.itemID}`, like)
  })
});


//HTTP Request Logger
app.use(morgan('tiny'));
app.use('/api', routes);
app.use('/api/v1/users/authentication', authRoutes);

app.post('/api/v1/items/upload-image', upload.single('item_image'), (async (req, res, next) => {

  const imageURL = await singlePublicFileUpload(req.file);
  console.log("this is imageurl", imageURL);
  //we should only get the path AFTER whatever is static...
  payload = {
    size: req.file.size,
    filename: req.file.filename,
    filepath: req.file.path,
    mimetype: req.file.mimetype,
    s3_url: imageURL
  }
 
  console.log("payload",payload);
  res.send(payload);
}));

//Step 3
if (process.env.NODE_ENV === 'production') {
  console.log("We are identifying production");
  app.use(express.static('client/build'));
} 

server.listen(PORT, console.log(`Server is starting at ${PORT}`));
