
module.exports.routes = {
  'post /login': 'AuthController.login',
  'post /signup': 'UserController.create',
  'post /hobby':  'HobbyController.insert'
};
