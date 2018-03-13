/**
 * AuthController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

  login: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');

    verifyParams(res, email, password)

    User.findOne({email: email}).then(function (user) {
      if (!user) {
        return invalidEmailOrPassword(res);
      }
      signInUser(req, res, password, user)
    }).catch(function (err) {
      return invalidEmailOrPassword(res);
    })
  }

};


function signInUser(req, res, password, user) {
  User.comparePassword(password, user).then(
    function (valid) {
      if (!valid) {
        return this.invalidEmailOrPassword();
      } else {
        var responseData = {
          user: user,
          token: generateToken(user.id),
          status: 200
        }
        return ResponseService.json(200, res, "Successfully signed in", responseData)
      }
    }
  ).catch(function (err) {
    return ResponseService.json(403, res, "Forbidden")
  })
};


function invalidEmailOrPassword(res){
  var responseData = {
    status: 401
  }
  return ResponseService.json(401, res, "Invalid email or password",responseData)
};

function verifyParams(res, email, password){
  var responseData = {
    status: 401
  }
  if (!email || !password) {
    return ResponseService.json(401, res, "Email and password required", responseData)
  }
};


function generateToken(user_id) {
  return JwtService.issue({id: user_id})
};
