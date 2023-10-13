"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "../../Footer/footer";
import Navigation from "../../Navigation/page";

const UserRegistration = ({}) => {
        const router = useRouter()
            const navigate = (location) => {
            router.push(location)
        }
    
    return (
        <>
            <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen">
            <Navigation/>
            <div className="grid grid-cols-3 gap-4 min-h-screen px-10 py-10">
            <div className="..." >
                <div className="w-full max-w-sm bg-slate-900 border border-black-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{height: '80vh'}}>
                    <div className="flex flex-col items-center pb-10 pt-20">
                        <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/Images/pic.jpeg" alt=""/>
                        <h5 className="mb-1 text-xl font-medium text-white dark:text-white">!!!Hurray!!!</h5>
                        <h3 className="mb-1 text-xl font-medium text-cyan-600 dark:text-white">Time to Explore</h3>
                        <span className="text-l text-gray-500 dark:text-gray-400"><b>USER</b></span>
                    </div>
                </div>
            </div>
            <div className="col-span-2 ..." style={{height: '80vh'}}>
                <div className="h-10"></div>
                <div className="flex-1 pt-10 h-auto max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
                    <div className="flex flex-col md:flex-row">
                        <div className="h-32 md:h-auto md:w-1/2 flex items-center justify-center">
                            <img className="h-auto max-w-full rounded-full shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30  hover:scale-110" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsAViZMnOVPRXHp8DW5tVMNadxV16MtQT-NA&usqp=CAU"
                                alt="img" />
                        </div>
                        <div className="flex items-center justify-center p-2 sm:p-12 md:w-1/2">
                            <div className="w-full">
                                <div className="flex justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-blue-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                    </svg>
                                </div>
                                <h1 className="mb-1 text-2xl font-bold text-center text-gray-700">Login to Your Account</h1>
                                <div>
                                    <label className="block mt-2 text-sm">UserTokenId</label>
                                    <input type="text"
                                        className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                        placeholder="Enter UserToken Id" />
                                </div>
                                <div>
                                    <label className="block mt-2 text-sm">Email</label>
                                    <input type="email"
                                        className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                        placeholder="abc@email.com" />
                                </div>
                                <div>
                                        <label className="block mt-2 text-sm">Phone Number</label>
                                        <input type="tel" name="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                            className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                            placeholder="333-444-5555" />
                                    </div>
                                <div>
                                    <label className="block mt-2 text-sm">Password</label>
                                    <input
                                        className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                        placeholder="abcdefg" type="password" />
                                </div>
                                <p>
                                    <a className="text-sm text-blue-600 hover:underline" href="./forgot-password.html">
                                        Forgot your password?
                                    </a>
                                </p>


                                <button onClick={() => navigate('/components/Account/userProfile')}
                                    className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
                                    Login
                                </button>


                                <hr className="my-2" />

                                <div className="flex items-center justify-center gap-4">
                                    <button onClick={() => navigate('/components/Account/userRegistration/userRegister')}
                                        className="flex items-center justify-center w-full px-4 py-2 text-sm text-black text-gray-700 border border-gray-300 rounded-lg hover:border-gray-500 focus:border-gray-500">
                                        Register
                                    </button>
                                    <button onClick={() => navigate('/components/Account')}
                                        className="flex items-center justify-center w-full px-4 py-2 text-sm text-black text-gray-700 border border-gray-300 rounded-lg hover:border-gray-500 focus:border-gray-500">
                                        Back to Account
                                    </button>
                                </div>
                            </div> 
                        </div>
                    </div> 
                </div> 
            </div>
            </div>
        <Footer/> 
        </div>
    </>
    )
}

export default UserRegistration
