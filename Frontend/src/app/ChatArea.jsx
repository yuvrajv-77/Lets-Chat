import { Avatar, Badge, Button, Input } from '@nextui-org/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Video from '../assets/video';
import Phone from '../assets/Phone';
import Option from '../assets/Option';
import Attach from '../assets/Attach';
import Send from '../assets/Send';
import MessageSelf from '../components/MessageSelf';
import MessageOther from '../components/MessageOther';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import Emoji from '../assets/Emoji';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

var  selectedChatCompare;

function ChatArea() {
    const { authUser, selectedChat } = useContext(AuthContext)
    const { socket, onlineUsers } = useContext(SocketContext)
    
    const otherUser = selectedChat.users[0]._id === authUser._id ? selectedChat.users[1] : selectedChat.users[0];
    const isOnline = onlineUsers.map(user => user.id).includes(otherUser._id)
    console.log('is online ', isOnline);
  

    const chatname = selectedChat.isGroupChat? selectedChat.chatName : otherUser.name;
    const chatavatar = selectedChat.isGroupChat? 'https://i.pravatar.cc/150?u=a04258114e29026302d' : otherUser.avatar;


    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const messageContainerRef = useRef(null);

    const sendMessage = async (event) => {

        if (event.key === "Enter" && newMessage) {
            event.preventDefault()
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${authUser?.token}`
                    }
                }
                setNewMessage("");
                const { data } = await axios.post(`http://localhost:6001/api/messages`, {
                    message: newMessage,
                    chatId: selectedChat?._id,
                }, config);
                console.log("message sent ", data);

                socket.emit("new_message", data.message);

                setMessages([...messages, data.message]) //🤬🤬🤬🤬🤬


                setLoading(false);

            } catch (error) {
                console.log("error in sending message ", error);
            }
        }
    }


    console.log("selected chat ", selectedChat);
 
    const typingHandler = (e) => {
        setNewMessage(e.target.value)
    }

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${authUser.token}`
                }
            }
            // setLoading(true);
            const { data } = await axios.get(`http://localhost:6001/api/messages/${selectedChat._id}`, config);
            setMessages(data);
            console.log("fetched messages ", data);
            // setLoading(false);

            socket.emit("join_room", selectedChat?._id);
        } catch (error) {
            console.log("error in fetching messages ", error);
        }
    }

   
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat?._id])

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    useEffect(() => {
        socket.on("message_received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chatId._id) {
                // give notif
            } else {
                setMessages([...messages, newMessageReceived]);
            }

        })
    })

    return (
        <div className='col-span-2 w-full border flex justify-between flex-col'>
            {/* <div className='grid grid-rows-7'> */}
            <div className='flex p-6 h- border justify-between  items-center'>

                <div className='flex gap-3 items-center'>
                    {isOnline ?
                        <Badge content="" color="success" shape="circle" placement="bottom-right">
                            <Avatar className="h-[60px] w-[60px]" src={chatavatar} />
                        </Badge> :
                        <Avatar className="h-[60px] w-[60px]" src={chatavatar} />
                    }

                    <div className="">
                        <h4 className='font-semibold'>{chatname}</h4>
                        <p className='text-xs '>{isOnline ? "Online" : ""}</p>
                    </div>
                </div>
                <div className='flex gap-3' >
                    <Video />
                    <Phone />
                    <Option />
                </div>
            </div>

            <div className=' h-[75vh] flex flex-col px-5 py-3 bg-pink-50 gap-3 overflow-auto ' ref={messageContainerRef} >
                { messages
                        .map((message, index) => {

                            const sender = message?.senderId._id;
                            const self_id = authUser?._id;

                            if (sender === self_id) {
                                return <MessageSelf key={index} message={message}/>
                            } else {
                                return <MessageOther key={index} message={message} />
                            }
                        })
                    
                }

            </div>

            <form className=' bg-white border flex gap-8 bottom-0 items-center p-6' onSubmit={sendMessage}>

                <div className='w-full flex'>

                    <Input className=''
                        startContent={
                            <Button isIconOnly variant='light' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                <Emoji />
                            </Button>
                        }
                        placeholder='Enter Your Message'
                        size='lg'
                        autoFocus
                        variant=''
                        value={newMessage}
                        onKeyDown={sendMessage}
                        onChange={typingHandler}
                        endContent={
                            <Button isIconOnly variant='light'>
                                <Attach />
                            </Button>
                        }
                    />

                    <div className='absolute bottom-20 left-1/4 shadow-xl rounded-xl'>
                        {showEmojiPicker &&  <Picker data={data} 
                        onClickOutside = {() => setShowEmojiPicker(false)}
                        previewPosition = 'none'
                        theme = 'light'
                        onEmojiSelect={(emoji) => setNewMessage((prevInput) => prevInput + emoji.native)} />}
                    </div>

                </div>

                {/* <button type='submit'>
                    <Send />
                </button> */}
            </form>

            {/* </div> */}
        </div>
    )
}

export default ChatArea;