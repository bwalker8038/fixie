
/*
 * GET users listing.
 */
var User = require('../models/user').User
  , fs   = require('fs');

exports.createUser = function(req, res, next) {
    res.render('users/new', { user: new User() });
};


exports.createUser_post = function(req, res, next) {
    var user = new User(req.body);
    user.saveAvatar(req.files.avatar, function() {
      user.save(function(err){
        if(err) {
          userSaveFailed();
        } else {
          userSaved();
        }
      });
    });

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
        res.render('./users/new', {user: user});
   }
};

exports.showUser = function(req, res, next) {
  User.find({ 'username': req.params.username}, function(err, user) {
    res.render('./users/show', {
      title: user.username,
      user: user,
      current_user: req.session.user
    });
  });
};

exports.list = function(req, res){
  res.send("respond with a resource");
};
