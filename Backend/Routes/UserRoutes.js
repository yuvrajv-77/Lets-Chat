const express = require('express');
const { loginController, registerController, searchUserController } = require('../Controllers/UserController');
const { protect } = require('../Middleware/Protect');
const Router = express.Router();


Router.post('/login',loginController);
Router.post('/register',registerController);
Router.get('/searchUsers',protect, searchUserController)


module.exports = Router;