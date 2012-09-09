var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var threadSchema = new Schema({
    title: String,
    discription: String,
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message'}],
    author: [{ type: Schema.Types.ObjectId, ref: 'Author'}],
    dateCreated: { type: Date, default: Date.now } 
});

exports.Thread = mongoose.model('Thread', threadSchema);
