import { Button, Checkbox, Divider, Image, Input } from '@nextui-org/react';
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';


function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [usernameError, setUsernameError] = useState("");

    const[showEmptyAlert, setShowEmptyAlert] = useState("false");
    const [showErrorAlert, setshowErrorAlert] = useState(false);

    const {authUser,setAuthUser} = useContext(AuthContext)


    const [isloading, setIsloading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();

    // var formIsValid = true;
    var areFieldsFilled = name && email && password && username;
    const isFormValid = areFieldsFilled && !nameError && !emailError && !passwordError && !usernameError && isChecked;

    if(authUser){
        navigate('/app')
    }
    const handleNameChange = (event) => {
        const name = event.target.value;
        setName(name);
        if (!name.trim()) {
          setNameError("Name is required");
         
        } else if (name.trim().length < 3) {
          setNameError("Name must be at least 3 characters");
        
        } else {
          setNameError("");
        }
      };
      
      const handleEmailChange = (event) => {
        setEmail(event.target.value);
        const email = event.target.value;
        if (!email) {
          setEmailError("Email is required");
        
        } else if (!email.includes("@")) {
          setEmailError("Email is not valid");
        
        } else {
          setEmailError("");
        }
      };
      
      const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        const username = event.target.value;
        if (!username) {
          setUsernameError("Username is required");
        
        } else if (username.length < 4) {
          setUsernameError("Username must be at least 4 characters");
        
        } else {
          setUsernameError("");
        }
      };
      
      const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        const password = event.target.value;
        if (!password) {
          setPasswordError("Password is required");
        
        } else if (password.length < 8) {
          setPasswordError("Password must be at least 8 characters");
        
        } else {
          setPasswordError("");
        }
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsloading(true);
        if (isFormValid) {
            try {
               
                // await new Promise(resolve => setTimeout(resolve, 1000));
                const response = await axios.post('http://localhost:6001/api/register', { name, email, password, username });
                console.log(response.data, response.status);
                // Handle the response here
                setAuthUser(response.data);
                localStorage.removeItem("userLocalData", JSON.stringify(response.data));
                localStorage.setItem("userLocalData", JSON.stringify(response.data));
                setIsloading(false);

                // navigate('/app');

                if (response.status === 200) {

                    setTimeout(() => navigate('/app'), 1000);

                } else {

                    console.log("Error");
                }

            } catch (error) {
                console.log("Error in registering user", error);
                setshowErrorAlert(true);
				setTimeout(() => setshowErrorAlert(false), 5000);
            }

        } else {
            setIsloading(false);
            setshowErrorAlert(true);
            console.log("Form validation failed");
        }
    }

    
    return (
        <>
            <div className='w-full h-screen justify-between items-center flex relative'>

                <section className=' h-full w-full flex items-center '>
                    <div className=' mx-auto  space-y-10  w-[25rem]'>
                        <h1 className='text-[40px] font-semibold'>Sign Up</h1>
                        <form onSubmit={handleSubmit} className=' flex gap-3 flex-col'>
                            <div>
                                <p className='mb-2'>Name</p>
                                <Input placeholder='Enter Your Name'
                                    size='lg'
                                    value={name}
                                    onChange={(e) => handleNameChange(e)}
                                    variant='bordered' />
                                     <p className="text-sm text-center h-2 text-red-500">{nameError}</p>
                            </div>
                            <div>
                                <p className='mb-2'>Email</p>
                                <Input placeholder='Enter Your Email'
                                    size='lg'
                                    value={email}
                                    onChange={(e) => handleEmailChange(e)}
                                    variant='bordered' />
                                     <p className="text-sm text-center h-2 text-red-500">{emailError}</p>
                            </div>
                            <div>
                                <p className='mb-2'>Username</p>
                                <Input placeholder='Create a Username'
                                    size='lg'
                                    value={username}
                                    onChange={(e) => handleUsernameChange(e)}
                                    variant='bordered' />
                                     <p className="text-sm text-center h-2 text-red-500">{usernameError}</p>
                            </div>
                            <div>
                                <p className='mb-2'>Password</p>
                                <Input placeholder='Create Password'
                                    size='lg'
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e)}
                                    variant='bordered' />
                                     <p className="text-sm text-center h-2 text-red-500">{passwordError}</p>
                            </div>
                            
                            <Checkbox
                                radius='full'
                                onChange={() => setIsChecked(!isChecked)}
                            >I agree to all Terms and Conditions.</Checkbox>

                            <div className='mt-6 space-y-6'>
                                <Button
                                    radius='full'
                                    size='lg'
                                    type='submit'
                                    loading={isloading}
                                    isDisabled={!isFormValid}
                                    color='primary'
                                    className='  w-full shadow-xl'>Create Account</Button>
                                {/* <Button
                                    radius='full'
                                    size='lg'
                                    className=' text-black w-full shadow-xl bg-white'>Google</Button> */}
                            </div>

                        </form>
                    </div>
                </section>

                <section className=' w-full h-full relative' >
                    <div className=' w-full h-full '>
                        <img className='object-cover w-full h-full rounded-l-3xl'
                            src="https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />

                    </div>
                    <div className='absolute space-x-5 top-5 right-5'>
                        <Link to='/'>
                        <Button size='lg' on>Sign Up</Button>
                        </Link>
                        <Link to='/login'>
                        <Button color='primary' size='lg'>Sign In</Button>
                        </Link>
                        
                       
                    </div>

                </section>
                
                {showErrorAlert && (
                    <div class="bg-red-50 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500 absolute bottom-8 right-8" role="alert">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                                <path d="M12 9v4"></path>
                                <path d="M12 17h.01"></path>
                            </svg>
                        </div>
                        <div class="ms-4">
                            <h3 class="text-sm font-semibold">
                                Some Error Has Been Occured
                            </h3>
                            <div class="mt-1 text-sm text-yellow-700">
                              Check for Errors in Console
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </>

    )
}

export default Register;