import React, { useContext } from 'react'
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import User from '../assets/User';
import Notification from '../assets/Notification';
import Search from '../assets/search'
import { AuthContext } from '../context/AuthContext';


function Profile() {
  const { authUser, selectedChat } = useContext(AuthContext)
  const loggedInUserId = authUser?._id; // Replace with your logged-in user's _id
  const otherUser = selectedChat?.users[0]._id === loggedInUserId ? selectedChat?.users[1] : selectedChat?.users[0];

  return (
    <div className='hidden lg:block col-end-5 border p-8'>
      <h2 className='font-semibold mb-9'>Profile</h2>
      <div className='w-full space-y-4'>
        <Card
          // isFooterBlurred
          radius="lg"
          className="border-none w-full flex justify-center items-center p-4"
        >
          <Image
            alt="Woman listing to music"
            className="object-cover "
            height={300}
            src="https://nextui.org/images/hero-card.jpeg"
            width={300}
          />
          <CardFooter className='flex  justify-center text-center flex-col z-10'>
            <h3 className='font-semibold'>
              {otherUser?.name}
            </h3>
            <p className='text-sm'>  @{otherUser?.username}</p>
            <div className='flex space-x-8 p-2'>
              <div className='p-2 rounded-full hover:bg-gray-200'>
                <User size='24' />
              </div>
              <div className='p-2 rounded-full hover:bg-gray-200'>
                <Notification size='24' />
              </div>
              <div className='p-2 rounded-full hover:bg-gray-200'>
                <Search size='24' />
              </div>
            </div>

          </CardFooter>
        </Card>


      </div>
    </div>
  )
}

export default Profile