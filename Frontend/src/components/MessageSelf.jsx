import React from 'react'

function MessageSelf({message}) {
    return (
        <div className='max-w-[400px] self-end'>

            <div className='text-sm rounded-l-3xl rounded-br-2xl text-white bg-blue-500 px-4 py-3'>
            {message.message}

            </div>
        </div>
    )
}

export default MessageSelf