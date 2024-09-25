const Chat = require("../models/ChatModel");
const TheUser = require("../Models/UserModel");
const ExAsyncHandler = require("express-async-handler");

const accessChatController = ExAsyncHandler(async (req, res) => {
	console.log('accessChatController called');
	const { userId } = req.body;		// other User's id to chat with

	if (!userId) {
		console.log("Userid param not sent with request");
		return res.status(400);
	}
	// check if chat already exists between the two users
	var isChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req.user._id } } },	// current user. in auth middleware, we have attached user to req
			{ users: { $elemMatch: { $eq: userId } } },		// other user
		],
	})
		.populate("users", "-password")	// populate users field with all fields except password
		.populate("latestMessage");		// populate latestMessage field

	isChat = await TheUser.populate(isChat, {	// populate latestMessage.sender field with name, avatar, email
		path: "latestMessage.sender",
		select: "name avatar email username",
	});

	// if chat already exists, return the chat
	if (isChat.length > 0) { 
		res.send(isChat[0]);
	} else {
		var chatData = {
			chatName: "sender",
			isGroupChat: false,
			users: [req.user._id, userId],
		};

		try{
			const createdChat = await Chat.create(chatData);
			const FullChat = await Chat.findOne({_id:createdChat._id}).populate(
				"users",'-password'
			);
			res.status(200).send(FullChat);
		}catch(error){
			res.status(400);
			console.log('Error Creating chat ', error);
		}
	}
	
});
const fetchChatController = ExAsyncHandler(async (req, res) => {
	try{
		await Chat.find({
			isGroupChat: false,
			users: { $elemMatch: { $eq: req.user._id } },	//check if logged in user is in any of  chat's users array
		})
			.populate("users", "-password")
			.populate("latestMessage")
			.populate("latestMessage.sender", "name avatar email")
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await TheUser.populate(results, {
				  path: "latestMessage.sender",
				  select: "name avatar email username",
				});
				res.status(200).send(results);
			});	
	}catch(error){
		res.status(400);
		console.log("❌📩❌ error in fetching chats ",error);

	}
});

const fetchGroupController = ExAsyncHandler(async (req, res) => {
	try{
		const userGroups = await Chat.find({
			isGroupChat: true,
			users: { $elemMatch: { $eq: req.user._id } }
		  }).populate("users", "-password").populate("latestMessage");
		res.status(200).send(userGroups);
	}catch(error){
		res.status(400);
		console.log("❌📩❌ error in fetching groups ",error);
	}
});
const accessGroupController = ExAsyncHandler(async (req, res) => {
    const { chatId } = req.body;
	console.log('accessGroupController called');
    if (!chatId) {
        console.log("ChatId param not sent with request");
        return res.status(400);
    }

    try {
        const chat = await Chat.findById(chatId)
            .populate("users", "-password")
            .populate("latestMessage")
            .populate("latestMessage.sender", "name avatar email");

        if (chat) {
            res.send(chat);
        } else {
            res.status(404);
            throw new Error("Chat not found");
        }
    } catch (error) {
        res.status(500);
        console.log("Error accessing group chat: ", error);
    }
});



const createGroupController = ExAsyncHandler(async(req, res) => {
	if(!req.body.users || !req.body.name){
		return res.status(400).send({message: "List of users and group name is required."});
	}

	var users = JSON.parse(req.body.users);

	if(users.length<2){
		return res.status(400).send({message: "Group must have atleast 2 members."});
	}

	users.push(req.user);

	try{
		const groupChat = await Chat.create({
			chatName: req.body.name,
            isGroupChat: true,
            users: users,
			groupAdmin: req.user,
		})
		const fullGroupChat = await Chat.findOne({_id: groupChat._id})
		.populate("users","-password")
		.populate("groupAdmin","-password")

		res.status(200).send(fullGroupChat);

	}catch(err){
		console.log(err);
		return res.status(400).send({message: "Error creating group chat."});
		
	}
})

const remaneGroupController = ExAsyncHandler(async(req,res) => {
	const {chatId,chatName} = req.body;

	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{
			chatName,
		},
		{
			new: true,
		}
	).populate("users", "-password")
	.populate("groupAdmin", "-password")

	if(!updatedChat){
		response.status(404);
		console.log("Error Chat May not Found");
	}else{
		res.send(updatedChat);
	}
})

const addGroupController = ExAsyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

	const added = await Chat.findByIdAndUpdate(chatId, {
		$push: { users: userId },
	}, 
	{ new: true },
	)
	.populate("users","-password")
	.populate("groupAdmin", "-password")

	if(!added){
		res.status(404);
		throw new Error("Chat Not found")
	}else{
		res.json(added);
	}
})

const removeGroupController = ExAsyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

	const remove = await Chat.findByIdAndUpdate(chatId, {
		$pull: { users: userId },
	}, 
	{ new: true },
	)
	.populate("users","-password")
	.populate("groupAdmin", "-password")

	if(!remove){
		res.status(404);
		throw new Error("Chat Not found")
	}else{
		res.json(remove);
	}
})

module.exports = {accessChatController, accessGroupController,fetchGroupController, fetchChatController, createGroupController, remaneGroupController, addGroupController, removeGroupController};