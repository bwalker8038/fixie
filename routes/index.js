
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', current_user: req.session.user });
  console.log(req.session.user);
};