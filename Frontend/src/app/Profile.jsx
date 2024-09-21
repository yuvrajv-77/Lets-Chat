import React, { useContext } from 'react'
import { Card, CardFooter, Image, Button, AvatarGroup, Avatar, Accordion, AccordionItem, Chip } from "@nextui-org/react";
import User from '../assets/User';
import Notification from '../assets/Notification';
import Search from '../assets/search'
import { AuthContext } from '../context/AuthContext';
import AddUsers from '../assets/AddUsers';
import Leave from '../assets/Leave';


function Profile() {
  const { authUser, selectedChat } = useContext(AuthContext)
  const loggedInUserId = authUser?._id; // Replace with your logged-in user's _id
  const otherUser = selectedChat?.users[0]._id === loggedInUserId ? selectedChat?.users[1] : selectedChat?.users[0];

  const chatname = selectedChat.isGroupChat ? selectedChat.chatName : otherUser.name;
  const chatavatar = selectedChat.isGroupChat ? '' : otherUser.avatar;
  const users = selectedChat.isGroupChat ? selectedChat.users : '';

  return (
    <div className='hidden lg:block col-end-5 border p-8'>
      {selectedChat.isGroupChat ? 
      <h2 className='font-semibold mb-9'>Group Info</h2> : 
      <h2 className='font-semibold mb-9'>Profile</h2>
      }
      
      <div className='w-full space-y-4'>
        <Card
          // isFooterBlurred
          radius="lg"
          className="border-none w-full flex justify-center items-center p-6"
        >
          {selectedChat?.isGroupChat ?
            <div className='my-3 size-36 bg-gray-200 rounded-full flex justify-center '>
              <AvatarGroup isBordered color='danger' max={3} >
                {users.map((user, index) => (
                  <Avatar src={user.avatar} size='md' key={index} />
                ))}
              </AvatarGroup>
            </div> :
            <Image
              alt="Woman listing to music"
              className="object-cover size-36 rounded-full"
              // height={100}
              isBlurred
              src={chatavatar}
            // width={100}
            />
          }
          <CardFooter className='flex   flex-col z-10'>
            <h3 className='font-semibold mt-1'>
              {chatname}
            </h3>

            {!selectedChat?.isGroupChat && <p className='text-sm text-sky-600'>  {otherUser?.username}</p>}

            {/* {selectedChat?.isGroupChat &&
              } */}
            {selectedChat?.isGroupChat &&
              <div className='px-4 flex items-center w-full justify-around mt-4'>
                <Button isIconOnly radius='full' variant='light'>
                  <AddUsers />
                </Button>
                <Button isIconOnly radius='full' variant='light'>
                  <Leave />
                </Button>
              </div>}

          </CardFooter>
        </Card>

        {/* ------ Members ------ */}

        {selectedChat?.isGroupChat && (
          <Card
            radius="lg"
            className="border-none flex px-6 py-4 "
          ><Accordion isCompact>
              <AccordionItem key="1" aria-label="Members" title="Group Members">
                <div className='space-y-3 w-full '>
                  {users.map((user, index) => (
                    <div key={index} className='flex items-center gap-3  '>
                      <Avatar src={user.avatar} size='md' className='flex-shrink-0' />
                      <div className='flex items-center justify-between  w-full'>
                        <p className='text-sm text-sky-600 '>{user.username}</p>
                        <span></span>
                        {selectedChat.groupAdmin === user._id && (
                          <Chip size='sm' color='success' radius='sm' className='text-white'>Admin</Chip>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionItem>

            </Accordion>

          </Card>
        )}
      </div>
    </div>
  )
}

export default Profile