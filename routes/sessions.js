var User = require('../models/user').User;

exports.newSession = function(req, res) {
    res.render('sessions/new', {redir: req.query.redir});
};

exports.newSession_post = function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user ){ 

    });
};
