var Thread = require('../models/thread').Thread;

exports.showThread = function(req, res) {
    Thread.findById(req.params.id, function(err, thread) {
        res.render('./thread/show', {thread: thread});
    });
};

exports.createThread = function(req, res) {
    res.render('./thread/new', { thread: new Thread() });
};

exports.createThread_post = function(req, res) {
    var thread = new Thread(req.body);
    thread.author = req.session.user._id;

    function threadSaved() {
        switch(req.params.format) {
        case 'json':
            res.send(thread.toObject());
        break;
        default:
            res.redirect('/threads/' + thread.id);
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

