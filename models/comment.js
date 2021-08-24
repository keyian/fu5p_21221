const mongoose = require('mongoose');

// Schema
const CommentSchema = new mongoose.Schema({
  text: {type: String, required: true},
  item: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item'},
  user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  userName: {type: String, required: true},
},
{
  timestamps: true
});


//Model
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
