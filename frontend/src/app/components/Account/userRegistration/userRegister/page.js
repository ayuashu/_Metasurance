"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation/page";
import Footer from "@/app/components/Footer/footer";

const HOST = "http://localhost:3000"


const UserRegister = () => {
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const handleUserRegistration = async (e) => {
        e.preventDefault()
        if (password != confirmPassword) {
            return alert("Passwords don't match")
        }
        if (username === "" || name === "" || phone === "" || email === "" || password === "") {
            return alert("Complete all fields for registration")
        }
        let url = `${HOST}/api/user/register`
        let body = {
            username,
            name,
            email,
            phone,
            password
        }
        console.log(body)
        const response = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
        })
        const json = await response.json();
        console.log(json)
        if (response.error) {
            alert(response.error)
        }
        if (response.status === 200) {
            alert(`Registration successful`)
            navigate("/components/Account/userProfile/")
        } else {
            alert(json.error);
        }
    }

    const router = useRouter()
    const navigate = (location, userid) => {
        router.push(location)
    }

    useEffect(() => {
        const checkUser = async () => {
            const response = await fetch(`${HOST}/api/user/readprofile`,
                {
                    method: "GET",
                })
            if (response.status === 200) { // user is logged in
                navigate("/components/Account/userProfile/")
            }
        }
        checkUser()
    }, [])
    return (
        <>
            <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen"
                style={{ overflowY: 'auto', height: '100%', margin: '0', padding: '0' }}>
                <style jsx global>{`html, body { overflow: hidden; height: 100%; margin: 0; padding: 0;}`}</style>
                <Navigation />
                <div className="grid grid-cols-3 gap-4 min-h-screen px-10 py-10">
                    <div className="..." >
                        <div className="w-full max-w-sm bg-slate-900 border border-black-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ height: '80vh' }}>
                            <div className="flex flex-col items-center pb-10 pt-20">
                                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/Images/pic.jpeg" alt="" />
                                <h5 className="mb-1 text-xl font-medium text-white dark:text-white">Hurray!</h5>
                                <h3 className="mb-1 text-xl font-medium text-cyan-600 dark:text-white">Time to Explore</h3>
                                <span className="text-l text-gray-500 dark:text-gray-400"><b>INSURED</b></span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 ..." style={{ height: '80vh' }}>

                        <div className="flex-1 h-auto max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
                            <div className="flex flex-col md:flex-row">
                                <div className="hidden h-32 md:block md:h-auto md:w-1/2 md:flex md:items-center md:justify-center">
                                    <img className="h-auto max-w-full rounded-full shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30  hover:scale-110"
                                        src="/Images/userRegister.jpg" alt="img" />
                                </div>
                                <div className="flex items-center justify-center p-2 sm:p-12 md:w-1/2">
                                    <div className="w-full">
                                        <div className="flex justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 48 48" id="lock"><g><g><ellipse cx="21.4" cy="45.1" fill="#45413c" opacity=".15" rx="13" ry="1.5"></ellipse><path fill="#ffe500" d="M28.5 38.3H7c-1.7 0-3-1.3-3-3v-16c0-1.7 1.3-3 3-3h21.5c1.7 0 3 1.3 3 3v16c0 1.6-1.4 3-3 3z"></path><path fill="#fff48c" d="M28.5 16.3H7c-1.7 0-3 1.3-3 3v4c0-1.7 1.3-3 3-3h21.5c1.7 0 3 1.3 3 3v-4c0-1.7-1.4-3-3-3z"></path><path fill="none" stroke="#45413c" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M28.5 38.3H7c-1.7 0-3-1.3-3-3v-16c0-1.7 1.3-3 3-3h21.5c1.7 0 3 1.3 3 3v16c0 1.6-1.4 3-3 3z"></path><path fill="#daedf7" d="M17.7 1.3C11.8 1.3 7 6.1 7 12v4.2h4.5V12c0-3.5 2.8-6.2 6.3-6.2S24 8.6 24 12v4.2h4.5V12c0-5.9-4.8-10.7-10.8-10.7z"></path><path fill="#fff" d="M17.7 1.3C11.8 1.3 7 6.1 7 12v2.5C7 8.6 11.8 3.8 17.7 3.8s10.8 4.8 10.8 10.8V12c0-5.9-4.8-10.7-10.8-10.7z"></path><path fill="none" stroke="#45413c" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M17.7 1.3C11.8 1.3 7 6.1 7 12v4.2h4.5V12c0-3.5 2.8-6.2 6.3-6.2S24 8.6 24 12v4.2h4.5V12c0-5.9-4.8-10.7-10.8-10.7z"></path><path fill="#ffaa54" d="M41.8 23.9c-2.9-2.9-7.7-2.9-10.6 0-2.3 2.3-2.8 5.7-1.5 8.5L20.2 42c-.2.2-.3.5-.3.8l.2 1.9c.1.5.4.8.9.9l1.9.2c.3 0 .6-.1.8-.3l1.1-1.1c.2-.2.3-.4.3-.7v-1h1c.3 0 .5-.1.7-.3l.9-.9c.2-.2.3-.4.3-.7v-.6c0-.3.1-.5.3-.7l1.2-1.2c.2-.2.4-.3.7-.3h.6c.3 0 .5-.1.7-.3l1.7-1.7c2.8 1.3 6.2.8 8.5-1.5 3-2.9 3-7.7.1-10.6zm-3.5 3.5c-.6-.6-.6-1.5 0-2.1.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0z"></path><g><path fill="#fc9" d="M31.2 27.1c2-2 4.8-2.6 7.3-1.9.6-.4 1.4-.4 1.9.2.3.3.4.6.4.9.4.2.7.5 1 .8 1.1 1.1 1.7 2.4 2 3.7.5-2.4-.2-5-2-6.9-2.9-2.9-7.7-2.9-10.6 0-1.9 1.9-2.5 4.5-2 6.9.3-1.4 1-2.7 2-3.7zM20.3 45.1l9.5-9.5c-.4-.8-.6-1.6-.7-2.5L20.2 42c-.2.2-.3.5-.3.8l.2 1.9c.1.1.1.2.2.4z"></path></g><path fill="none" stroke="#45413c" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M41.8 23.9c-2.9-2.9-7.7-2.9-10.6 0-2.3 2.3-2.8 5.7-1.5 8.5L20.2 42c-.2.2-.3.5-.3.8l.2 1.9c.1.5.4.8.9.9l1.9.2c.3 0 .6-.1.8-.3l1.1-1.1c.2-.2.3-.4.3-.7v-1h1c.3 0 .5-.1.7-.3l.9-.9c.2-.2.3-.4.3-.7v-.6c0-.3.1-.5.3-.7l1.2-1.2c.2-.2.4-.3.7-.3h.6c.3 0 .5-.1.7-.3l1.7-1.7c2.8 1.3 6.2.8 8.5-1.5 3-2.9 3-7.7.1-10.6zm-3.5 3.5c-.6-.6-.6-1.5 0-2.1.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0zM20.3 44.8l9.1-9.2"></path></g></g></svg>
                                        </div>
                                        <h1 className="mb-1 text-2xl font-bold text-center text-gray-700">Register with New Account</h1>
                                        <div>
                                            <label className="block mt-2 text-sm">Username</label>
                                            <input type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                placeholder="Enter Your Username" />
                                        </div>
                                        <div>
                                            <label className="block mt-2 text-sm">Name</label>
                                            <input type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                placeholder="Enter Your Name" />
                                        </div>
                                        <div>
                                            <label className="block mt-2 text-sm">Email</label>
                                            <input type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                placeholder="abc@email.com" />
                                        </div>
                                        <div>
                                            <label className="block mt-2 text-sm">Phone Number</label>
                                            <input type="tel" name="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                placeholder="333-444-5555" />
                                        </div>
                                        <div>
                                            <label className="block mt-2 text-sm">Password</label>
                                            <input
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                placeholder="abcdefg" type="password" />
                                        </div>
                                        <div>
                                            <label className="block mt-2 text-sm">Confirm Password</label>
                                            <input
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                placeholder="abcdefg" type="password" />
                                        </div>


                                        <button onClick={(e) => handleUserRegistration(e)}
                                            className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
                                            Register
                                        </button>


                                        <hr className="my-2" />

                                        <div className="flex items-center justify-center gap-4">
                                            <button onClick={() => navigate('/components/Account/userRegistration')}
                                                className="flex items-center justify-center w-full px-4 py-2 text-sm text-black text-gray-700 border border-gray-300 rounded-lg hover:border-gray-500 focus:border-gray-500">
                                                Login
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
                <Footer />
            </div>
        </>
    )
}

export default UserRegister
