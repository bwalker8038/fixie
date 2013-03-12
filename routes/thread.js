var Thread  = require('../models/thread').Thread
  , Message = require('../models/message').Message
  , User    = require('../models/user').User;

exports.listThreads = function(req, res) {
    Thread.find({ author: req.session.user._id})
    .populate('author')
    .exec(function(err, threads) {
        console.log(threads);
        res.render('./thread/index', {
            current_user: req.session.user,
            threads: threads
        });
    });
};

exports.showThread = function(req, res) {
    Thread.findById(req.params.id)
    .populate('messages')
    .populate('author')
    .exec(function(err, thread){
        var opts = {
            path: 'messages.author',
            select: 'username'
        }

        res.render('./thread/show', {
            title: 'foo', 
            thread: thread,
            current_user: req.session.user 
        });
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