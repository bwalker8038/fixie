var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var serviceSchema = new Schema({
    name: String,
    discription: String,
    email: String,
    phoneNumber: String,
    storeHours: Array,
    author: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    dateCreated: { type: Date, default: Date.now } 
});

exports.Thread = mongoose.model('Service', serviceSchema);