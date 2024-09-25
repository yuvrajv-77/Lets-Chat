const express = require('express');
const {accessChatController,accessGroupController,fetchGroupController, fetchChatController, createGroupController, remaneGroupController, addGroupController, removeGroupController} = require('../Controllers/ChatController');
const { protect } = require('../Middleware/Protect');
const Router = express.Router();

// api/chat/
Router.post('/', protect, accessChatController);
Router.route('/').get(protect, fetchChatController);
Router.route('/groups').get(protect, fetchGroupController);
Router.route('/newgroup').post(protect, createGroupController);
Router.route('/accessgroup').post(protect, accessGroupController);
Router.route('/rename').put(protect, remaneGroupController);
Router.route('/groupremove').put(protect, removeGroupController);
Router.route('/groupadd').put(protect, addGroupController);

module.exports = Router;