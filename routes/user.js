
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

    fs.readFile(req.files.avatar.path, function(err, data) {
      var newPath = __dirname + '/uploads/' + req.files.avatar.name;
      fs.writeFile(newPath, data, function(err, data) {
        if(err) {
          console.log(err);
        } else {
          user.avatar = '/' + req.files.avatar.name;

          user.save(function(err) {
            if(err) { 
                userSaveFailed();
            } else {
                userSaved();
            }
          });
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
