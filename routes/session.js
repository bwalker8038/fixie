var url = require('url')
  , User = require('../models/user').User;

exports.newSession = function(req, res) {
    if(req.session.user) { 
        res.redirect('back');
    }
    res.render('sessions/new', { redir: req.query.redir });
};

exports.newSession_post = function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user ){ 
        var rurl = '/', query = url.parse(req.url, true).query;

        if(user && user.authenticate(req.body.password)) {
            req.session.regenerate(function() {
                req.session.user = user;
                if(query.redirect) {
                    rurl = decodeURIComponent(query.redirect);
                }
                res.redirect(rurl);
            });
        } else {
            res.redirect('/sessions/new');
        }
    });
};

exports.destroySession = function(req, res) { 
    delete req.session.user;
    res.redirect('/sessions/new');
};


