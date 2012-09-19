var Thread = require('../models/thread').Thread;

exports.createThread = function(req, res) {
    res.render('./thread/new', { thread: new Thread() });
};

exports.createThread_post = function(req, res) {
    var thread = new Thread(req.body);
    thread.author = req.session.currentUser;

    function threadSaved() {
        switch(req.params.format) {
        case 'json':
            res.send(thread.toObject());
        break;
        default:
            res.redirect('/thread/:id');
        }
    }

    function threadSaveFailed() {
        res.render('./thread/new', {thread: thread});
    }

    thread.save(function(err) {
        if(err) { 
            threadSaveFailed();
        } else {
            threadSaved();
        }
    });
};

exports.showThread = function(req, res) {
    res.render('./thread/show');
};

