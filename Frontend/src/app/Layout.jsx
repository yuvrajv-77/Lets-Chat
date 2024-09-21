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

function Layout() {
	const navigate = useNavigate()

	const { authUser, setAuthUser, selectedChat } = useContext(AuthContext)
	
	return (
		<div className='flex'>
			<Sidebar/>
			<div className='grid  grid-cols-4  w-full h-screen '>
				<ChatList />		
				{
					selectedChat ? (
						<>
							<ChatArea />
							<Profile />
						</>
					) : (
						<div className='flex col-span-2 w-full items-center justify-center'>
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