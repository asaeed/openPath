/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'openPath'});
};

exports.main = function(req, res){
  res.render('main', { title: 'openPath'});
};
exports.about = function(req, res){
  res.render('about', { title: 'About | openPath'});
};
exports.privacyPolicy = function(req, res){
  res.render('privacy-policy', { title: 'Privacy Policy | openPath'});
};
exports.termsOfService = function(req, res){
  res.render('terms-of-service', { title: 'Terms of Service | openPath'});
};
exports.pressKit = function(req, res){
  res.render('press-kit', { title: 'Press Kit | openPath'});
};
