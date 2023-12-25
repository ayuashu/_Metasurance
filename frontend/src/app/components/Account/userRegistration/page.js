"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../Footer/footer";
import Navigation from "../../Navigation/page";

const HOST = "http://localhost:3000"

const UserRegistration = ({ }) => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = (location) => {
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

    const handleLogin = async (e) => {
        e.preventDefault()
        if (username === "" || password === "") {
            alert("Please fill all the fields")
            return
        }
        const result = await fetch(`${HOST}/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        })
        const response = await result.json()
        if (response.error) {
            alert("Invalid Credentials")
            return
        }
        if (result.status === 200) {
            navigate('/components/Account/userProfile/')
        } else {
            alert("Invalid Credentials")
        }
    }

    return (
        <>
            <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen"
                style={{ overflowY: 'hidden', height: '100%', margin: '0', padding: '0' }}>
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
                        <div className="h-10"></div>
                        <div className="flex-1 pt-10 h-auto max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
                            <div className="flex flex-col md:flex-row">
                                <div className="h-32 md:h-auto md:w-1/2 flex items-center justify-center">
                                    <img className="h-auto w-max-full rounded-full shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30  hover:scale-110"
                                        src="/Images/userLogin.webp" alt="img" />
                                </div>
                                <div className="flex items-center justify-center p-2 sm:p-12 md:w-1/2">
                                    <div className="w-full">
                                        <div className="flex justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" enableBackground="new 0 0 64 64" viewBox="0 0 64 64" id="key"><path fill="#7DA4C3" d="M37.05,29.245l-2.667-2.666c-0.291-0.291-0.38-0.728-0.226-1.109c2.678-6.615,1.147-14.151-3.898-19.198
                                        c-6.912-6.911-18.161-6.911-25.074,0c-6.913,6.913-6.913,18.161,0,25.074c5.045,5.045,12.58,6.576,19.197,3.899
                                        c0.125-0.051,0.256-0.075,0.385-0.075c0.268,0,0.529,0.104,0.725,0.301l2.667,2.666L37.05,29.245z M16.22,17.89
                                        c-1.2,1.199-2.775,1.8-4.352,1.8c-1.576,0-3.152-0.601-4.352-1.8c-2.399-2.399-2.399-6.304,0-8.703s6.304-2.399,8.703,0
                                        C18.62,11.586,18.62,15.491,16.22,17.89z"></path><path fill="#6691AD" d="M36.964,32.23l-6.09,6.09l4.075,4.074l3.338-0.135c0.517-0.041,0.981,0.357,1.056,0.878l0.506,3.498
                                        l2.825-0.294c0.308-0.038,0.612,0.075,0.831,0.294l4.153,4.152c0.249,0.249,0.353,0.606,0.276,0.949l-0.622,2.777l2.792-0.029
                                        c0.51,0.013,0.951,0.371,1.025,0.88l0.414,2.879l2.65,0.098c0.388,0.014,0.733,0.244,0.895,0.597l1.703,3.709l6.678,0.266
                                        L64,59.266L36.964,32.23z"></path>
                                            </svg>
                                        </div>
                                        <h1 className="mb-1 text-2xl font-bold text-center text-gray-700">Login to Your Account</h1>
                                        <div>
                                            <label className="block mt-2 text-sm">Username</label>
                                            <input type="text"
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter Your UserName" />
                                        </div>
                                        <div>
                                            <label className="block mt-2 text-sm">Password</label>
                                            <input
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="abcdefg" type="password" />
                                        </div>


                                        <button onClick={(e) => handleLogin(e)}
                                            className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
                                            Login
                                        </button>


                                        <hr className="my-2" />

                                        <div className="flex items-center justify-center gap-4">
                                            <button onClick={() => navigate('/components/Account/userRegistration/userRegister')}
                                                className="flex items-center justify-center w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-lg hover:border-gray-500 focus:border-gray-500">
                                                Register
                                            </button>
                                            <button onClick={() => navigate('/components/Account')}
                                                className="flex items-center justify-center w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-lg hover:border-gray-500 focus:border-gray-500">
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

export default UserRegistration
