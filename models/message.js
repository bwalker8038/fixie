var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var messageSchema = new Schema({
    body: String,
    author: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    dateCreated: { type: Date, default: Date.now }
});

exports.Message = mongoose.model('Message', messageSchema);
