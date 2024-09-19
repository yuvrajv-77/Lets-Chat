import { Avatar } from '@nextui-org/react'
import React from 'react'



function MessageOther({ message }) {
    return (
        <div className='max-w-[500px] self-start gap-3 flex'>

            <Avatar className='min-w-[40px]' src={'https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=600'} alt="avatar" size="md" />

            <div className=' text-sm rounded-r-3xl rounded-b-2xl bg-white p-4'>
                {message.message}
            </div>
        </div>
    )
}

export default MessageOther