import { Avatar } from '@nextui-org/react'
import React from 'react'

function MessageOther({ message }) {
    console.log("message: ", message);

    var senderName = '';
    if(message.chatId.isGroupChat){
        senderName = message.senderId.name;
    }
 
    
    
    return (
        <div className='max-w-[500px] self-start gap-3 flex'>

            <Avatar className='min-w-[40px]' src={message.senderId.avatar} alt="avatar" size="md" />

            <div className='  rounded-r-3xl rounded-b-2xl bg-white px-4 py-3'>
                <p className=' text-xs text-purple-600'>{senderName}</p>
                <p className='text-md'>{message.message}</p>
                
            </div>
        </div>
    )
}

export default MessageOther