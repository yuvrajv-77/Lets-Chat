import { Avatar, AvatarGroup, Badge, Button, Input } from '@nextui-org/react'
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
import { SlOptions } from "react-icons/sl";
import { PiPhone } from 'react-icons/pi';

var selectedChatCompare;

function ChatArea(props) {
    const { authUser, selectedChat } = useContext(AuthContext)
    const { socket, onlineUsers } = useContext(SocketContext)

    const otherUser = selectedChat.users[0]._id === authUser._id ? selectedChat.users[1] : selectedChat.users[0];
    const isOnline = onlineUsers.map(user => user.id).includes(otherUser._id)
    console.log('is online ', isOnline);


    const chatname = selectedChat.isGroupChat ? selectedChat.chatName : otherUser.name;
    const chatavatar = selectedChat.isGroupChat ? 'https://static.vecteezy.com/system/resources/previews/036/378/364/non_2x/group-icon-symbol-design-illustration-vector.jpg' : otherUser.avatar;
    const users = selectedChat.isGroupChat ? selectedChat.users : '';

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
        <div className = '  col-span-2 w-full h-screen relative  flex flex-col'>
           {/* -------Header----- */}
            <div className='flex p-4 sticky top-0  justify-between bg-white items-center'>

                <div className='flex gap-3 items-center'>
                    {!selectedChat.isGroupChat && isOnline ?
                        <Badge content="" color="success" shape="circle" placement="bottom-right">
                            <Avatar className="md:h-[60px] md:w-[60px]" src={chatavatar} />
                        </Badge> :
                        <Avatar className="md:h-[60px] md:w-[60px]" src={chatavatar} />
                    }

                    <div className="">
                        <h4 className='text-sm font-semibold'>{chatname}</h4>
                        <p className='text-xs '>{isOnline ? "Online" : ""}</p>
                    </div>
                </div>
                <div className='flex  md:gap-3 items-center' >
                    {!selectedChat.isGroupChat &&
                        <>
                            <Button isIconOnly variant='light' radius='full' >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="black" fill="none">
                                    <path d="M11 8L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    <path d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M17 8.90585L17.1259 8.80196C19.2417 7.05623 20.2996 6.18336 21.1498 6.60482C22 7.02628 22 8.42355 22 11.2181V12.7819C22 15.5765 22 16.9737 21.1498 17.3952C20.2996 17.8166 19.2417 16.9438 17.1259 15.198L17 15.0941" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                </svg>
                            </Button>
                            <Button isIconOnly variant='light' radius='full' >
                                <PiPhone size={20} />
                            </Button>
                        </>
                    }
                    {selectedChat.isGroupChat &&
                     <AvatarGroup isBordered color='danger' className='hidden md:flex' max={3} >
                        {users.map((user, index) => (
                            <Avatar src={user.avatar} size='sm' key={index} />
                        ))}
                    </AvatarGroup>}
                    <Button isIconOnly variant='light' radius='full' >
                        <SlOptions size={18} />
                    </Button>

                </div>
            </div>
            {/* --------messages--------- */}
            <div className='flex-grow border flex flex-col px-5 py-3 bg-pink-50 gap-3 overflow-y-auto ' ref={messageContainerRef} >
                {messages
                    .map((message, index) => {
                        const sender = message?.senderId._id;
                        const self_id = authUser?._id;

                        if (sender === self_id) {
                            return <MessageSelf key={index} message={message} />
                        } else {
                            return <MessageOther key={index} message={message} />
                        }
                    })

                }

            </div>
                {/* ---------Input--------- */}
            <form className=' bg-white sticky bottom-0 w-full flex gap-8 items-center p-6' onSubmit={sendMessage}>

                <div className='w-full flex'>

                    <Input className=''
                        startContent={
                            <Button isIconOnly variant='light' className='hidden md:flex' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
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
                        {showEmojiPicker && <Picker data={data}
                            onClickOutside={() => setShowEmojiPicker(false)}
                            previewPosition='none'
                            theme='light'
                            onEmojiSelect={(emoji) => setNewMessage((prevInput) => prevInput + emoji.native)} />}
                    </div>
                </div>
            </form>

            {/* </div> */}
        </div>
    )
}

export default ChatArea;