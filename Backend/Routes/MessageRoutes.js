const express = require('express');
const { protect } = require('../Middleware/Protect');
const { sendMessageController, getAllMessagesController } = require('../Controllers/MessageController');
const Router = express.Router();

//  /api/messages
Router.post('/', protect, sendMessageController);
Router.get('/:chatId', protect, getAllMessagesController);


module.exports = Router;