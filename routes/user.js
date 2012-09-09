
/*
 * GET users listing.
 */
var mongoose = require('mongoose')
  , User = mongoose.model('User');

exports.createUser = function(req, res) {
    var user = new User(req.body);

    function userSaved() {
        switch (req.params.format) {
        case 'json':
            res.send(user.toObject());
        break;
       default:
           req.session.currentUser = user;
           res.redirect('/');
        }
    }
    function userSaveFailed() {
        res.render('./users/new');
    }

    user.save(function(err) {
        if(err) { 
            userSaveFailed();
        } else {
            userSaved();
        }
    });
};

exports.list = function(req, res){
  res.send("respond with a resource");
};
