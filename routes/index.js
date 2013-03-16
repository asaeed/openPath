
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'openPath', email: req.session.email || null });
};