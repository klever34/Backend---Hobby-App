/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');

module.exports = {
  create: function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
      return ResponseService.json(401, res, "Password doesn't match")
    }

    var allowedParameters = [
      "email", "password" , "phone"
    ]

    var data = _.pick(req.body, allowedParameters);

    User.create(data).then(function (user) {
      var responseData = {
        user: user,
        phone: user.phone,
        token: JwtService.issue({id: user.id})
      }
      sails.log(data)
      return ResponseService.json(200, res, "User created successfully", {responseData})
    }).catch(function (error) {
        if (error.invalidAttributes){
          sails.log(error)
          return ResponseService.json(400, res, "User could not be created", error.Errors)
        }
      }
    )

  }
};
