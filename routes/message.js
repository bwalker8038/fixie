var Message = require('../models/message').message;

exports.showMessage = function(req, res) {
    Message.findById(req.params.id, function(err, message) {
        res.render('./message/show', {message: message});
    });
}

exports.createMessage = function(session)
  var message = new Message(data);
  message.author = session.user._id

  message.save(function(err) {
    if(err) {
      util.log('\033[32m'+'info: \033[0m '+err);
    } else {
      util.log('\033[32m'+'info: \033[0m message saved');
    }
};