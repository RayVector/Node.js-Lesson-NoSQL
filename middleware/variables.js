module.exports = function (req, res, next) {
  res.locals.isAuth = req.session.isAuthenticated;
  res.locals.userName = req.session.user ? req.session.user.name : null;
  res.locals.csrf = req.csrfToken();
  next()
};