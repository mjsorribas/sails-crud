/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

  // User is allowed, proceed to controller
  if (req.session.User && req.session.User.roles === 'admin') {
    return ok();
  }

  // User is not allowed
  return res.forbidden('You are not permitted to perform this action.');
}; 