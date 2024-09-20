import React, { useContext, useState } from 'react'
import { Avatar, Button, Chip, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { AuthContext } from '../context/AuthContext';
import Add from '../assets/Add';
import axios from 'axios';

const CreateGroupModal = ({ isNewGroupOpen, onNewGroupOpenChange, chats }) => {

    const [groupName, setGroupName] = useState('');
    const { authUser, setFetch } = useContext(AuthContext)
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupSuccess, setGroupSuccess] = useState(false);


    const handleCreateGroup = async () => {
        console.log("handle create group called");
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${authUser?.token}`
                }
            }
            const data  = await axios.post('http://localhost:6001/api/chat/newgroup', { name: groupName, users: JSON.stringify(selectedUsers.map((user) => user._id)) }, config);
            console.log("group created ", data);
            if(data.status === 200){
                setGroupSuccess(true);
            }
            setFetch((prev) => prev + 1);
            setSelectedUsers([]);
            setGroupName('');
        } catch (error) {
            console.log("error in creating group ", error);
        }
    }

    console.log("selected users for grp : ", selectedUsers);
    console.log('group success ', groupSuccess);
    


    return (
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
                                required
                                className=''
                            />
                            {/* Chips */}
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
                                {selectedUsers.map((user) => (

                                    <Chip
                                        variant="flat"
                                        size='lg'
                                        key={user._id}
                                        color='primary'
                                        className='py-5'
                                        onClose={() => setSelectedUsers(selectedUsers.filter(u => u._id !== user._id))}
                                        avatar={
                                            <Avatar
                                                name="JW"
                                                src="https://i.pravatar.cc/300?u=a042581f4e29026709d"
                                            />
                                        }
                                    >
                                        {user.name}
                                    </Chip>
                                ))}

                            </div>

                            <div className=''>
                                <h6>Add Users</h6>
                                <div className='max-h-[300px] overflow-auto'>
                                    {/* list of chats to add */}
                                    {
                                        chats.map((chat) => {
                                            const otherUser = chat.users[0]._id === authUser._id ? chat.users[1] : chat.users[0];
                                            const isOtherUserSelected = selectedUsers.some(user => user._id === otherUser._id);
                                            return (
                                                <div key={otherUser?._id} className={`flex mt-2 pr-2 justify-between items-center cursor-pointer ${isOtherUserSelected && 'bg-blue-200'} ${!isOtherUserSelected && 'hover:bg-slate-100'} rounded-lg`}
                                                    onClick={() => {
                                                        if (!isOtherUserSelected) {
                                                            setSelectedUsers([...selectedUsers, otherUser]);
                                                        }
                                                    }}>
                                                    <div className='flex p-2 gap-x-4 items-center'>
                                                        <div>
                                                            <Avatar size='md' className="" src={otherUser?.avatar} />
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
                        <div className='animate-appearance-in'>
                            {groupSuccess && <h5 className='text-green-500 text-center'>Group Created Successfully</h5>}
                        </div>
                        <ModalFooter>
                            <Button color="danger" 
                            onClick={() => {
                                setSelectedUsers([]); 
                                setGroupName('')}
                                } 
                                variant="flat" 
                                onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" 
                            onClick={handleCreateGroup} 
                            onPress={() => setTimeout(() => {
                                onClose();
                                setGroupSuccess(false);
                                }, 3000)} >
                                Create Group
                            </Button>
                            
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default CreateGroupModal