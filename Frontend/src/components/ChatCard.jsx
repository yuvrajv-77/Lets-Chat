import React, { useContext, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { Avatar, Badge } from '@nextui-org/react'
import { SocketContext } from '../context/SocketContext'
import { AuthContext } from '../context/AuthContext'

function ChatCard({ data, lastMsg, id, onClick, groupChat }) {
    const { onlineUsers } = useContext(SocketContext)
    const { authUser, selectedChat } = useContext(AuthContext)
    const isOnline = onlineUsers.map(user => user.id).includes(data?._id)

    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        setIsSelected(false);
        if (selectedChat?._id == id) {
            setIsSelected(true);
        }else{
            setIsSelected(false);
        }
    },[selectedChat])
    // if(chat?.isGroupChat){
    //     setChatName(chat?.chatName)   
    // }else{
    //     setChatName(chat?.users[0]._id === authUser._id ? chat.users[1] : chat.users[0]);
    // }

    // const lastMessage = chat.latestMessage?.message

    // const chatname = chat?.isGroupChat? chat?.chatname : chat?.users[0]._id === authUser._id ? chat?.users[1].name : chat?.users[0].name;
    // useEffect(() => {
    //     if(chat?.isGroupChat){
    //       setChatName(chat?.chatName);
    //     }else{
    //       setChatName(chat?.users[0]._id === authUser._id ? chat?.users[1].name : chat?.users[0].name);
    //     }
    //   }, [chat]);
    return (

        <motion.div whileTap={{ scale: 0.9 }} className={`flex mt-2 p-3 gap-x-4 items-center cursor-pointer hover:bg-slate-100 ${isSelected ? "bg-gray-100" : ""} rounded-lg`} onClick={onClick}>
            <div>
                {isOnline ?
                    <Badge content="" color="success" shape="circle" placement="bottom-right">
                        <Avatar className="h-[60px] w-[60px]" src='https://i.pravatar.cc/150?u=a04258114e29026302d' />
                    </Badge> :
                    <Avatar className="h-[60px] w-[60px]" src='https://i.pravatar.cc/150?u=a04258114e29026302d' />
                }
            </div>
            <div className='w-full flex '>
                <div className='flex flex-col items-start justify-between pr-1 gap-1'>
                    <p className='font-semibold'>{data}</p>
                    <p className='text-xs text-gray-600  line-clamp-1'>
                        {lastMsg}
                    </p>
                </div>

                <div className=' flex flex-col items-end justify-between'>
                    <p className='text-xs text-gray-600'>5:30</p>
                    <span className='bg-red-500 text-white text-xs bg-second-500 text-center size-4 rounded-full  '>3</span>
                </div>

            </div>
        </motion.div>
    )
}

export default ChatCard