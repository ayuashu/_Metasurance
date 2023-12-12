'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation/page'
import Footer from '@/app/components/Footer/footer'

const HOST = 'http://localhost:3000'

const addPolicy = ({ name }) => {
    const [policyname, setPolicyName] = useState('')
    const [insurancetype, setInsuranceType] = useState('NFT')
    const [premiumamount, setPremiumAmount] = useState('')
    const [insurancecover, setInsuranceCover] = useState('')
    // const [description, setDescription] = useState("")

    const router = useRouter()
    const navigate = (location) => {
        router.push(location)
    }

    useEffect(() => {
        const policy = localStorage.getItem('policy')
        if (policy) {
            navigate('/components/Account/companyProfile/')
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()

        if (
            policyname === '' ||
            insurancetype === '' ||
            premiumamount === '' ||
            insurancecover === ''
        ) {
            return alert('Complete all fields for registration')
        }
        const result = await fetch(`${HOST}/api/company/createPolicy`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                policyname,
                premiumamount,
                insurancecover,
                insurancetype,
            }),
        })
        const response = await result.json()
        if (response.error) {
            alert(response.error)
        }
        if (result.status === 200) {
            localStorage.setItem(
                'asset',
                JSON.stringify({
                    policyname,
                    premiumamount,
                    insurancecover,
                    insurancetype,
                }),
            )
            alert('Policy Registered Successfully')
            navigate('/components/Account/companyProfile/')
        } else {
            alert(response.error)
        }
    }
    return (
        <>
            <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen"
                style={{ overflowY: 'hidden', height: '100%', margin: '0', padding: '0' }}>
                <style jsx global>{`html, body { overflow: hidden; height: 100%; margin: 0; padding: 0;}`}</style>
                <Navigation />
                <div className="grid grid-cols-3 gap-4 min-h-screen px-10 py-10">
                    <div className="...">
                        <div
                            className="w-full max-w-sm bg-slate-900 border border-black-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                            style={{ height: '80vh' }}
                        >
                            <div className="flex flex-col items-center pb-10 pt-20">
                                <img
                                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                                    src="/Images/pic.jpeg" alt=""
                                />
                                <h5 className="mb-1 text-xl font-medium text-white dark:text-white">
                                    Hurray!
                                </h5>
                                <h3 className="mb-1 text-xl font-medium text-cyan-600 dark:text-white">
                                    A new journey begins!
                                </h3>
                                <span className="text-l text-gray-500 dark:text-gray-400">
                                    <b>COMPANY{name}</b>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 ...">
                        <div className="flex-1 pt-10 h-auto max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
                            <div className="flex flex-col md:flex-row">
                                <div className="h-32 md:h-auto md:w-1/2 flex items-center justify-center">
                                    <img
                                        className="h-auto max-w-full rounded-full shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30  hover:scale-110"
                                        src="/Images/policy.jpeg" alt="img"
                                    />
                                </div>
                                <div className="flex items-center justify-center  sm:p-12 md:w-1/2">
                                    <div className="w-full">
                                        <div className="flex justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 48 48" id="lock">
                                                <g>
                                                    <g>
                                                        <ellipse cx="21.4" cy="45.1" fill="#45413c" opacity=".15" rx="13" ry="1.5" ></ellipse>
                                                        <path
                                                            fill="#ffe500"
                                                            d="M28.5 38.3H7c-1.7 0-3-1.3-3-3v-16c0-1.7 1.3-3 3-3h21.5c1.7 0 3 1.3 3 3v16c0 1.6-1.4 3-3 3z"
                                                        ></path>
                                                        <path
                                                            fill="#fff48c"
                                                            d="M28.5 16.3H7c-1.7 0-3 1.3-3 3v4c0-1.7 1.3-3 3-3h21.5c1.7 0 3 1.3 3 3v-4c0-1.7-1.4-3-3-3z"
                                                        ></path>
                                                        <path
                                                            fill="none" stroke="#45413c" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
                                                            d="M28.5 38.3H7c-1.7 0-3-1.3-3-3v-16c0-1.7 1.3-3 3-3h21.5c1.7 0 3 1.3 3 3v16c0 1.6-1.4 3-3 3z"
                                                        ></path>
                                                        <path
                                                            fill="#daedf7"
                                                            d="M17.7 1.3C11.8 1.3 7 6.1 7 12v4.2h4.5V12c0-3.5 2.8-6.2 6.3-6.2S24 8.6 24 12v4.2h4.5V12c0-5.9-4.8-10.7-10.8-10.7z"
                                                        ></path>
                                                        <path
                                                            fill="#fff"
                                                            d="M17.7 1.3C11.8 1.3 7 6.1 7 12v2.5C7 8.6 11.8 3.8 17.7 3.8s10.8 4.8 10.8 10.8V12c0-5.9-4.8-10.7-10.8-10.7z"
                                                        ></path>
                                                        <path
                                                            fill="none" stroke="#45413c" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
                                                            d="M17.7 1.3C11.8 1.3 7 6.1 7 12v4.2h4.5V12c0-3.5 2.8-6.2 6.3-6.2S24 8.6 24 12v4.2h4.5V12c0-5.9-4.8-10.7-10.8-10.7z"
                                                        ></path>
                                                        <path
                                                            fill="#ffaa54"
                                                            d="M41.8 23.9c-2.9-2.9-7.7-2.9-10.6 0-2.3 2.3-2.8 5.7-1.5 8.5L20.2 42c-.2.2-.3.5-.3.8l.2 1.9c.1.5.4.8.9.9l1.9.2c.3 0 .6-.1.8-.3l1.1-1.1c.2-.2.3-.4.3-.7v-1h1c.3 0 .5-.1.7-.3l.9-.9c.2-.2.3-.4.3-.7v-.6c0-.3.1-.5.3-.7l1.2-1.2c.2-.2.4-.3.7-.3h.6c.3 0 .5-.1.7-.3l1.7-1.7c2.8 1.3 6.2.8 8.5-1.5 3-2.9 3-7.7.1-10.6zm-3.5 3.5c-.6-.6-.6-1.5 0-2.1.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0z"
                                                        ></path>
                                                        <g>
                                                            <path
                                                                fill="#fc9"
                                                                d="M31.2 27.1c2-2 4.8-2.6 7.3-1.9.6-.4 1.4-.4 1.9.2.3.3.4.6.4.9.4.2.7.5 1 .8 1.1 1.1 1.7 2.4 2 3.7.5-2.4-.2-5-2-6.9-2.9-2.9-7.7-2.9-10.6 0-1.9 1.9-2.5 4.5-2 6.9.3-1.4 1-2.7 2-3.7zM20.3 45.1l9.5-9.5c-.4-.8-.6-1.6-.7-2.5L20.2 42c-.2.2-.3.5-.3.8l.2 1.9c.1.1.1.2.2.4z"
                                                            ></path>
                                                        </g>
                                                        <path
                                                            fill="none" stroke="#45413c" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
                                                            d="M41.8 23.9c-2.9-2.9-7.7-2.9-10.6 0-2.3 2.3-2.8 5.7-1.5 8.5L20.2 42c-.2.2-.3.5-.3.8l.2 1.9c.1.5.4.8.9.9l1.9.2c.3 0 .6-.1.8-.3l1.1-1.1c.2-.2.3-.4.3-.7v-1h1c.3 0 .5-.1.7-.3l.9-.9c.2-.2.3-.4.3-.7v-.6c0-.3.1-.5.3-.7l1.2-1.2c.2-.2.4-.3.7-.3h.6c.3 0 .5-.1.7-.3l1.7-1.7c2.8 1.3 6.2.8 8.5-1.5 3-2.9 3-7.7.1-10.6zm-3.5 3.5c-.6-.6-.6-1.5 0-2.1.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0zM20.3 44.8l9.1-9.2"
                                                        ></path>
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                        <h1 className="mb-1 text-2xl font-bold text-center text-gray-700">
                                            Register New Policy
                                        </h1>

                                        <div>
                                            <label className="block mt-2 text-sm">
                                                Policy Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                value={policyname}
                                                onChange={(e) => setPolicyName(e.target.value)}
                                                placeholder="NFTsurance, Avatarsurance, ...."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mt-2 text-sm">
                                                Insurance Type
                                            </label>
                                            <select value={insurancetype} onChange={(e) => setInsuranceType(e.target.value)}>
                                                <option value="NFT">NFT</option>
                                                <option value="Virtual Land">Virtual Land</option>
                                                <option value="Avatar">Avatar</option>
                                                <option value="Cryptocurrency">Cryptocurrency</option>
                                                <option value="Digital Files">Digital Files</option>
                                                <option value="Domain Names">Domain Names</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mt-2 text-sm">
                                                Premium Amount (in INR)
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                value={premiumamount}
                                                onChange={(e) => setPremiumAmount(e.target.value)}
                                                placeholder="Enter the Premium Value"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mt-2 text-sm">
                                                Insurance Cover Duration (in years)
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                value={insurancecover}
                                                onChange={(e) => setInsuranceCover(e.target.value)}
                                                placeholder="Enter the duration of Policy"
                                            />
                                        </div>
                                        {/* <div>
                                            <label className="block mt-2 text-sm">Description</label>
                                            <textarea
                                                className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Enter a description for your policy"
                                            ></textarea>
                                        </div> */}
                                        <button onClick={(e) => handleLogin(e)}
                                            className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
                                            Register
                                        </button>

                                        <hr className="my-2" />

                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => navigate('/components/Account/companyProfile',)}
                                                className="flex items-center justify-center w-full px-4 py-2 text-sm text-black text-gray-700 border border-gray-300 rounded-lg hover:border-gray-500 focus:border-gray-500">
                                                Back to Profile
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

export default addPolicy
