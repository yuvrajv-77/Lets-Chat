import { Avatar, Button, Chip, Input, ScrollShadow, Skeleton, User } from '@nextui-org/react'
import React, { useContext, useEffect, useState } from 'react'
import Search from '../assets/search'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, cn, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Link } from "@nextui-org/react";
import ChatCard from '../components/ChatCard';
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Add from '../assets/Add'
import AddUsers from '../assets/AddUsers';
import AddToGroup from '../assets/AddToGroup';
import { motion } from "framer-motion"
import ChatSkeleton from '../components/ChatSkeleton';
import { useNavigate } from 'react-router-dom';


function ChatList() {
  const { authUser, selectedChat, setSelectedChat } = useContext(AuthContext)
  const [chats, setChats] = useState([]);
  const [groups, setGroups] = useState([]);
  const { isOpen: isNewChatOpen, onOpen: onNewChatOpen, onOpenChange: onNewChatOpenChange } = useDisclosure();
  const { isOpen: isNewGroupOpen, onOpen: onNewGroupOpen, onOpenChange: onNewGroupOpenChange } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupUsers, setGroupUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isfetching, setIsfetching] = useState(false);


  const handleUserSearch = async (e) => {
    console.log("handle chat search called");
    // Handle the search here
    try {
      setSearchLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${authUser?.token}`
        }
      }

      const { data } = await axios.get(`http://localhost:6001/api/searchUsers?search=${searchTerm}`, config);
      setSearchResult(data);
      console.log('search result: ', data);

      setSearchLoading(false);
    } catch (error) {
      console.log("error in search ", error)
    }

  }

  const fetchChats = async () => {
    try {
      setIsfetching(true);
      const config = {
        headers: {
          Authorization: `Bearer ${authUser?.token}`
        }
      }

      const { data } = await axios.get(`http://localhost:6001/api/chat`, config);
      setChats(data);

    }
    catch (error) {
      console.log("error in fetching chats in fd", error);
    }
    setIsfetching(false);
  }
  console.log("fetched chats ", chats);

  useEffect(() => {
    if (authUser) {
      fetchChats();
      fetchGroupChat();
    }
  }, [authUser]);


  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser?.token}`
        }
      }
      setSelectedChat();
      const { data } = await axios.post('http://localhost:6001/api/chat', { userId }, config);
      setSelectedChat(data);
      console.log("chat accessed ", data);

      setSearchResult([])
      setSearchTerm('')

    }
    catch (error) {
      console.log("error in accessing chats", error)
    }
    console.log("selected chat: ", selectedChat);
  }

  const fetchGroupChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser?.token}`
        }
      }

      const { data } = await axios.get(`http://localhost:6001/api/chat/groups`, config);
      console.log("groups fetched ", data);
      setGroups(data);


    } catch (error) {
      console.log("error in fetching groups", error)
    }
  }
  const accessGroupChat = async (chatId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authUser?.token}`
        }
      }

      const { data } = await axios.post('http://localhost:6001/api/chat/accessgroup', { chatId }, config);
      setSelectedChat(data);
      console.log("group accessed ", data);
      console.log("selected chat: ", selectedChat);
      setSearchResult([])
      setSearchTerm('')

    }
    catch (error) {
      console.log("error in accessing group", error)
    }
  }



  return (
    <div className='col-start-1 py-5 px-2 h-full '>

      <div className='flex items-center justify-between mb-5 p-3'>
        <h1 className='font-semibold'>Messages</h1>
        <div className=' rounded-full cursor-pointer'>
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant='light'
                radius='full'
              >
                <Add />
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
              <DropdownItem
                key="new"
                shortcut="⌘N"
                startContent={<AddUsers />}
                onPress={onNewChatOpen}
              >
                New Message
              </DropdownItem>
              <DropdownItem
                key="copy"
                shortcut="⌘C"
                onPress={onNewGroupOpen}
                startContent={<AddToGroup />}
              >
                Create Group
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className='mb-6 flex items-center gap-4'>
        <Input
          size='lg'
          startContent={<Search />}
          placeholder='Search' />

      </div>
      <ScrollShadow className='overflow-auto overflow-x-hidden h-[80vh]  '>
        <div >
          {isfetching ? <div className='space-y-4'>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />

          </div>
            : <>
              {groups.map((group, index) => {
                return <ChatCard data={group.chatName} key={index} lastMsg={group.latestMessage?.message} onClick={() => accessGroupChat(group._id)} />
              })
              }
              {chats.map((chat, index) => {

                const otherUser = chat.users[0]._id === authUser._id ? chat.users[1] : chat.users[0];
                const chatname = chat.users[0]._id === authUser._id ? chat.users[1].name : chat.users[0].name;
                const lastMessage = chat.latestMessage?.message
                return <ChatCard data={chatname} key={index} id={chat._id} lastMsg={lastMessage} onClick={() => {
                  accessChat(otherUser);
                }} />
              })}

            </>
          }
        </div>
      </ScrollShadow>

      {/* new chat modal */}
      <Modal
        isOpen={isNewChatOpen}
        onOpenChange={onNewChatOpenChange}
        placement="top-center"
        backdrop='blur'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">New Chat</ModalHeader>
              <ModalBody className='space-y-3'>
                <Input
                  autoFocus
                  value={searchTerm}
                  label="Username"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="bordered"
                />
                <div className='cursor-pointer hover:bg-gray-100 p-3 rounded-xl'>
                  {searchTerm.length > 0 && (
                    <>
                      {searchLoading ? (
                        <ChatSkeleton />
                      ) : searchResult.length > 0 ? (
                        searchResult.map((user, index) => (
                          <motion.div whileTap={{ scale: 0.9 }} onClick={() => { accessChat(user._id); onClose() }} className='cursor-pointer hover:bg-gray-100 flex items-center rounded-xl'>
                            <User
                              key={index}
                              name={user.name}
                              description={(
                                <p>{user.username}</p>
                              )}
                              avatarProps={{
                                size: 'md',
                                src: "https://avatars.githubusercontent.com/u/30373425?v=4"
                              }}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <p>not found</p>
                      )}
                    </>
                  )}

                </div>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={handleUserSearch} >
                  Search
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Create new group  */}
      <Modal
        isOpen={isNewGroupOpen}
        onOpenChange={onNewGroupOpenChange}
        placement="top-center"
        backdrop='blur'
        size='lg'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create New Group</ModalHeader>
              <ModalBody className='space-y-3'>
                <Input
                  autoFocus
                  value={groupName}
                  label="Enter Group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                  variant="bordered"
                  size='lg'
                />
                <div className='flex flex-wrap gap-3'>
                  <Chip
                    variant="flat"
                    size='lg'
                    color='success'
                    className='py-5'
                    avatar={
                      <Avatar
                        name="JW"
                        src="https://i.pravatar.cc/300?u=a042581f4e29026709d"
                      />
                    }
                  >
                    You
                  </Chip>
                  <Chip
                    variant="flat"
                    size='lg'
                    color='primary'
                    className='py-5'
                    onClose={() => console.log("close")}
                    avatar={
                      <Avatar
                        name="JW"
                        src="https://i.pravatar.cc/300?u=a042581f4e29026709d"
                      />
                    }
                  >
                    Avatar
                  </Chip>

                </div>

                <div className=''>
                  <h6>Add Chats</h6>
                  <div className='max-h-[300px] overflow-auto'>

                    {
                      chats.map((chat, index) => {
                        const otherUser = chat.users[0]._id === authUser._id ? chat.users[1] : chat.users[0];
                        return (
                          <div key={index} className={`flex mt-2 pr-2 justify-between items-center  cursor-pointer hover:bg-slate-100  rounded-lg`} >
                            <div className='flex p-2 gap-x-4 items-center'>
                              <div>
                                <Avatar size='md' className="" src='https://i.pravatar.cc/150?u=a04258114e29026302d' />
                              </div>
                              <div className='flex flex-col justify-center'>
                                <p className='font-'>{otherUser.name}</p>
                                <p className='font-light text-xs text-blue-500'>{otherUser.username}</p>
                              </div>
                            </div>
                            <Add />
                          </div>
                        )
                      })}
                  </div>


                </div>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={handleUserSearch} >
                  Create Group
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  )
}

export default ChatList