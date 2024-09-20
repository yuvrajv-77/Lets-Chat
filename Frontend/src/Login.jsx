import React, { useContext, useState } from 'react'
import {EyeFilledIcon} from "./assets/EyeFilledIcon";
import {EyeSlashFilledIcon} from "./assets/EyeSlashFilledIcon";
import { Button, Checkbox, Divider, Image, Input } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';

function Login() {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [authError, setAuthError] = useState("");

    const [isloading, setIsloading] = useState(false);		// sets loading prop of Button
    const [isChecked, setIsChecked] = useState(false);

	const {authUser,setAuthUser} = useContext(AuthContext)


    const navigate = useNavigate();

    // var formIsValid = true;
    // var areFieldsFilled =  email && password;
    const isFormValid = email && password && !emailError && !passwordError;


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
				await new Promise(resolve => setTimeout(resolve, 1000));
				const response = await axios.post('http://localhost:6001/api/login', { email, password });
				console.log(response.data);

				// Handle the response here
				setIsloading(false);
				console.log("Logged in");
				
				localStorage.removeItem("userLocalData", JSON.stringify(response.data));
				localStorage.setItem("userLocalData", JSON.stringify(response.data));
                setAuthUser(response.data);
                setTimeout(() => navigate('/app'), 1000);

				if (response.status === 200) {
					// setshowSuccessAlert(true);
					// setTimeout(() => setshowSuccessAlert(false), 5000); // Hide after 5 seconds
				}
				else {
					console.log("No User Found");
				}


			} catch (error) {
				setIsloading(false);
				if (error.response && error.response.status === 400) {
					console.log("No User catch");
                    setAuthError("Username or Password is Incorrect");
				} else {
					console.log("Error in login user", error);
                    setAuthError("An Error has occurred");
					// setshowErrorAlert(true);
					// setTimeout(() => setshowErrorAlert(false), 5000);
				}
			}
		} else {
			setIsloading(false);

			console.log("Form validation failed");
		}
    }

    return (
        <div>
            <div className='w-full h-screen justify-between items-center flex '>

                <section className=' h-full w-full flex items-center '>
                    <div className=' mx-auto  space-y-10  w-[25rem]'>
                        <h1 className='text-[40px] font-semibold'>Sign In</h1>
                        <form className=' flex gap-3 flex-col' onSubmit={handleSubmit}>

                            <div>
                                <p className='mb-2'>Email</p>
                                <Input placeholder='Enter Your Email'
                                    size='lg'
                                    value={email}
                                    onChange={(e) => handleEmailChange(e)}
                                    className='text-sm'
                                    variant='bordered' />
                                 <p className="text-sm text-center h-3 text-red-500">{emailError}</p>

                            </div>
                            <div>
                                <p className='mb-2'>Password</p>
                                <Input
                                    placeholder='Enter Password'
                                    size='lg'
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e)}
                                    variant='bordered'
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                          {isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                          ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                          )}
                                        </button>
                                      }
                                      type={isVisible ? "text" : "password"} />
                                    <p className="text-sm text-center h-3 text-red-500">{passwordError}</p>
                            </div>

                            <Checkbox radius='full'
                             onChange={() => setIsChecked(!isChecked)}>
                                Remember me</Checkbox>

                            <p className="text-sm text-center text-red-500">{authError}</p>


                            <div className='mt-6 space-y-6'>
                                <Button
                                    radius='full'
                                    size='lg'
                                    color='primary'
                                    isLoading = {isloading}
                                    isDisabled={!isFormValid}
                                    type='submit'
                                    className='  w-full shadow-xl '>Sign In</Button>
                                {/* <Button
                                    radius='full'
                                    size='lg'
                                    className=' text-black w-full shadow-xl bg-white'>Google</Button> */}
                            </div>

                        </form>
                    </div>
                </section>

                <section className=' w-full h-full relative'  >
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
            </div>
        </div>
    )
}

export default Login