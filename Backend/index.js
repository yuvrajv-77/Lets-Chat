const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const { Server } = require("socket.io");
const { createServer } = require("http");

const UserRoutes = require("./Routes/UserRoutes");
const ChatRoutes = require("./Routes/ChatRoutes");
const MessageRoutes = require("./Routes/MessageRoutes");


const app = express();
const server = createServer(app);

const allowedOrigins = [
  'https://lets-chat-k4dr.onrender.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.json());

dbUrl = `mongodb+srv://y74125:${process.env.DB_PASSWORD}@mycluster.gv0hwf0.mongodb.net/chatapp?retryWrites=true&w=majority`

async function connectDB(){
    try{
        await mongoose.connect(dbUrl)
        console.log("✅ Connected to Database ✅")
    }catch(e){
        console.log("❌Failed to connect to Database❌ ",e)
    }
}

connectDB()

app.use('/api',UserRoutes)
app.use('/api/chat',ChatRoutes);
app.use('/api/messages',MessageRoutes);


// Start server
server.listen(process.env.PORT || 6001, () => {
    console.log("🗃️  Server is started and running");
});

const io = new Server(server, { 
    cors: {
        origin: allowedOrigins,
    methods: ["GET", "POST"]
        credentials: true
    }
 });

 let users = [];

 io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    const username = socket.handshake.query.username;
    if(userId && username){ 
        const user = {
            id:userId,
            socketId:socket.id,
            username:username
        };
        users.push(user);
        console.log('Connected Users : ',users);
    }

    socket.on('setup', (userData) => {
        socket.join(userData);
        socket.emit('connected');
    })

    io.emit('onlineUsers',users);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);
    });

    socket.on("new_message", (newMessageReceived) => {
        var chat = newMessageReceived.chatId;
        // console.log('chat : ',chat);
        
        if(!chat.users) return console.log("chat.users not defined");
        chat.users.forEach(user => {
            if(user == newMessageReceived.senderId._id) return;

            socket.in(user).emit("message_received", newMessageReceived);

        });

    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        users = users.filter((user) => user.socketId !== socket.id);
        io.emit('onlineUsers',users);
        console.log('Connected Users : ', users);
    });
 })
