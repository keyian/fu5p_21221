const mongoose = require('mongoose');

// Schema
const UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
  lastLogin: {type: Date, required: true},
  picture: {type: String, required: true},
  fbid: {type: String, required: true},
  email: {type: String, required: true}
},
{
  timestamps: true
});


//Model
const User = mongoose.model('User', UserSchema);



module.exports = User;
