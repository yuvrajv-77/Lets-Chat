import { Avatar, Button, Link, User } from '@nextui-org/react'
import React, { useContext } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from "@nextui-org/react";

import ChatList from './ChatList';
import ChatArea from './ChatArea';
import Profile from './Profile';
import Chat from '../assets/Chat';
import Phone from '../assets/Phone';

import Setting from '../assets/Setting';
import Notes from '../assets/Notes';
import { AuthContext } from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import Leave from '../assets/Leave';
import Sidebar from './Sidebar';
import BottomNavbar from './BottomNavbar';

function Layout() {
	const navigate = useNavigate()

	const { selectedChat } = useContext(AuthContext)
	
	return (
		<div className='flex h-screen relative'>
			<Sidebar/>
			<BottomNavbar className={`md:hidden bg-white fixed z-20 py-2 bottom-0 border-t w-full ${selectedChat ? 'hidden' : 'block'} `}/>
			<div className='lg:grid  grid-cols-4  w-full h-full  '>
				<ChatList  className={`col-start-1 md:flex flex-col h-screen py-5 px-2 border-r  ${!selectedChat ? 'block' : 'hidden'} `}/>		
				{selectedChat ? (
						<>
							<ChatArea />
							<Profile className='hidden lg:block col-end-5 border p-8' />
						</>
					) : (
						<div className='hidden md:flex col-span-2 w-full items-center justify-center'>
							<Card className="max-w-[400px]">
								<CardHeader className="flex gap-3">
									<Image
										alt="nextui logo"
										height={40}
										radius="sm"
										src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
										width={40}
									/>
									<div className="flex flex-col">
										<p className="text-md">NextUI</p>
										<p className="text-small text-default-500">nextui.org</p>
									</div>
								</CardHeader>
								<Divider />
								<CardBody>
									<p>Select a Chat or Add New User To Start Messenging</p>
								</CardBody>
								<Divider />
								<CardFooter>
									<Link
										isExternal
										showAnchorIcon
										href="https://github.com/nextui-org/nextui"
									>
										Visit source code on GitHub.
									</Link>
								</CardFooter>
							</Card>
						</div>
					)
				}


			</div>
		</div>
	)
}

export default Layout;