import Chat from '../assets/Chat';
import Phone from '../assets/Phone';
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Tooltip } from '@nextui-org/react'
import Setting from '../assets/Setting';
import Notes from '../assets/Notes';
import { AuthContext } from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import Leave from '../assets/Leave';
import React, { useContext, useState } from 'react'
import { User } from '@nextui-org/react';

const Sidebar = (props) => {

    const navigate = useNavigate()

    const { authUser, setAuthUser } = useContext(AuthContext)
    const [activeButton, setActiveButton] = useState('chat');

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };
    return (
        <div className='hidden md:flex flex-col border-r justify-between items-center h-screen  py-10 md:px-10 '>
            <div className='space-y-20'>
                <h1 className='text-center'>🐯</h1>

                <div className='space-y-5 '>
                    <Tooltip showArrow={true} placement='right' content="Chats">
                        <Button
                            isIconOnly
                            size='lg'
                            color={activeButton === 'chat' && 'primary'}
                            className='flex'
                            onClick={() => handleButtonClick('chat')}
                        >
                            <Chat white={activeButton === 'chat'} />
                        </Button>
                    </Tooltip>
                    {/* <Tooltip showArrow={true} placement='right' content="Calls">
                        <Button
                            isIconOnly 
                            size='lg'
                            color={activeButton === 'phone' && 'primary'}
                            className='flex'
                            onClick={() => handleButtonClick('phone')}
                        >
                            <Phone white={activeButton === 'phone'} />
                        </Button></Tooltip>
                    <Tooltip showArrow={true} placement='right' content="Notes">

                        <Button
                            isIconOnly
                            size='lg'
                            color={activeButton === 'notes' && 'primary'}
                            className='flex'
                            onClick={() => handleButtonClick('notes')}
                        >
                            <Notes white={activeButton === 'notes'} />
                        </Button></Tooltip> */}

                    <Button isIconOnly size='lg' variant='light'  onClick={() => {
                        localStorage.removeItem('userLocalData');
                        setAuthUser(null);
                        navigate('/login');
                    }} className='flex cursor-pointer   font-medium hover:bg-gray-200'>
                        <Leave />
                    </Button>

                </div>
            </div>

            <div className=''>
                <Dropdown placement='right'>
                    <DropdownTrigger>
                        <Avatar src={authUser?.avatar} alt="avatar" size="md" isBordered color='danger' />
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem >
                            <p className='text-lg font-semibold'>{authUser?.name}</p>
                            <p className='text-sm text-sky-400'>{authUser?.username}</p>
                        </DropdownItem>
                        <DropdownItem><p className='text-pink-600'>Logout</p> </DropdownItem>
                    </DropdownMenu>
                </Dropdown>



            </div>
        </div>
    )
}

export default Sidebar