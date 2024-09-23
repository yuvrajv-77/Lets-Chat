import { Avatar, Button } from '@nextui-org/react'
import React, { useContext } from 'react'
import Chat from '../assets/Chat'
import Notes from '../assets/Notes'
import Phone from '../assets/Phone'
import { AuthContext } from '../context/AuthContext'
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import { PiPhone } from "react-icons/pi";

const BottomNavbar = (props) => {

    const { authUser } = useContext(AuthContext);
    return (
        <div {...props}>
            <div className='flex justify-evenly items-center'>
                <Button
                    isIconOnly
                    size='md'
                    color= ''   radius='full'
                    className='flex'
                >
                    <PiPhone size={20} />
                </Button>
                <Button
                    isIconOnly
                    size='md'
                    color= 'primary'   radius='full'
                    className='flex'
                >
                     <HiOutlineChatBubbleBottomCenterText size={20} />
                </Button>
                <Avatar src={authUser?.avatar} alt="avatar" size="sm"   />

            </div>
        </div>
    )
}

export default BottomNavbar