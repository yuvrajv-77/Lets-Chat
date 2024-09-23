import React, { useContext, useState } from 'react'
import { Card, CardFooter, Image, Button, AvatarGroup, Avatar, Accordion, AccordionItem, Chip, Popover, PopoverTrigger, PopoverContent, Input } from "@nextui-org/react";
import User from '../assets/User';

import { AuthContext } from '../context/AuthContext';
import AddUsers from '../assets/AddUsers';
import Leave from '../assets/Leave';

function Profile(props) {
  const { authUser, selectedChat, chats } = useContext(AuthContext)

  

  const isGroupChat = selectedChat?.isGroupChat;
  const otherUser = selectedChat.users.find(user => user._id !== authUser?._id);

  const allOtherUsers = chats.map(chat => chat.users.find(user => user._id !== authUser?._id))
  const groupMembers = isGroupChat ? selectedChat.users : [];
  const notInGroup = allOtherUsers.filter(user => !groupMembers.some(member => member._id === user._id))

  return (
    <div {...props} >
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
          {isGroupChat ?
            <div className='my-3 size-36 bg-gray-200 rounded-full flex justify-center '>
              <AvatarGroup isBordered color='danger' max={3} >
                {groupMembers.map((user, index) => (
                  <Avatar src={user.avatar} size='md' key={index} />
                ))}
              </AvatarGroup>
            </div> :
            <Image
              alt="Woman listing to music"
              className="object-cover size-36 rounded-full"
              // height={100}
              isBlurred
              src={isGroupChat ? '' : otherUser.avatar}
            // width={100}
            />
          }
          <CardFooter className='flex   flex-col z-10'>
            <h3 className='font-semibold mt-1'>
              {isGroupChat ? selectedChat.chatName : otherUser.name}
            </h3>

            {!selectedChat?.isGroupChat && <p className='text-sm text-sky-600'>  {otherUser?.username}</p>}

            {/* {selectedChat?.isGroupChat &&
              } */}
            {isGroupChat &&
              <div className='px-4 flex items-center w-full justify-around mt-4'>
                <Popover placement='bottom'>
                  <PopoverTrigger>
                    <Button isIconOnly radius='full' variant='light'>
                      <AddUsers />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>

                    <div className=' p-6 '>
                      <h5 className='font-semibold text-xl mb-3'>Add Users</h5>
                      <div className=' overflow-auto space-y-1'>
                        {/* list of chats to add */}
                        {notInGroup.map((user, index) => (
                          <div className='flex p-2 gap-x-4 items-center cursor-pointer border-b'>
                            <div>
                              <Avatar size='md' className="" src={user.avatar} />
                            </div>
                            <div className='flex flex-col justify-center'>
                              <p className='font-'>{user.name}</p>
                              <p className='font-light text-xs text-blue-500'>{user.username}</p>
                            </div>
                          </div>
                        ))}
                      </div>


                    </div>
                  </PopoverContent>
                </Popover>

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
          >
            <Accordion isCompact>
              <AccordionItem key="1" aria-label="Members" title="Members"

                startContent={
                  <AvatarGroup isBordered color='danger' max={2} >
                    {groupMembers.map((user, index) => (
                      <Avatar src={user.avatar} size='sm' key={index} />
                    ))}
                  </AvatarGroup>
                }
              >
                <div className='space-y-3 w-full '>
                  {groupMembers.map((user, index) => (
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