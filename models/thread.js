var mongoose = require('mongoose')
  , messageSchema = require('./message').Message
  , Schema = mongoose.Schema;

var threadSchema = new Schema({
    title: String,
    discription: String,
    messages: [messageSchema],
    author: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    dateCreated: { type: Date, default: Date.now } 
});

exports.Thread = mongoose.model('Thread', threadSchema);
