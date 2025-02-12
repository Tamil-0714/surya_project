function isLogin(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
}
function isAlreadyLogin(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    return next();
  }
}

export { isLogin, isAlreadyLogin };
