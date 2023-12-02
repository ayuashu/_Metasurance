'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '../Navigation/page'
import Footer from '../Footer/footer'
import ProfileAnimation from '../PolicyAnimation/ProfileAnimation/page'
import ProfileAnimation1 from '../PolicyAnimation/ProfileAnimation1/page'

const HOST = 'http://localhost:3000'

const Account = () => {
    const router = useRouter()
    const navigate = (location) => {
        router.push(location)
    }

    // if user had auth cookie, directly send to respective profile
    useEffect(() => {
        async function checkAuth() {
            let response = await fetch(`${HOST}/api/user/readProfile`, {
                method: 'GET',
                credentials: 'include',
            })
            let data = await response.json()
            if (response.status === 200 && !response.error) {
                navigate('/components/Account/userProfile')
            }

            response = await fetch(`${HOST}/api/company/readProfile`, {
                method: 'GET',
                credentials: 'include',
            })
            data = await response.json()
            if (response.status === 200 && !response.error) {
                navigate('/components/Account/companyProfile')
            }
        }
        try {
            checkAuth()
        } catch (error) {
            console.log(error)
        }
    }, [])

    return (
        <>
            <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen">
                <Navigation />
                <div className="grid grid-cols-3 gap-4 min-h-screen px-10 py-10">
                    <div className="..." style={{ height: '80vh' }}>
                        <div className="w-full max-w-sm min-h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex flex-col items-center pb-10 pt-20">
                                <img
                                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                                    src="/Images/pic.jpeg"
                                    alt=""
                                />
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                                    Hurray !
                                </h5>
                                <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white">
                                    Time to Explore
                                </h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    User/Company/Verifier
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 ...">
                        <div className="flex items-center justify-end pt-5 gap-4">
                            <button
                                onClick={() =>
                                    navigate(
                                        '/components/Account/userRegistration',
                                    )
                                }
                                className="h-20 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-600 rounded-full focus:shadow-outline hover:bg-slate-900"
                            >
                                <b>
                                    Use Service<p>(USER)</p>
                                </b>
                            </button>
                            <button
                                onClick={() =>
                                    navigate(
                                        '/components/Account/companyRegistration',
                                    )
                                }
                                className="h-20 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-600 rounded-full focus:shadow-outline hover:bg-slate-900"
                            >
                                <b>
                                    Give Service<p>(COMPANY)</p>
                                </b>
                            </button>
                            <button
                                onClick={() =>
                                    navigate(
                                        '/components/Account/verifierRegistration',
                                    )
                                }
                                className="h-20 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-600 rounded-full focus:shadow-outline hover:bg-slate-900"
                            >
                                <b>
                                    Verify Claims<p>(VERIFIER)</p>
                                </b>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-20 pt-20">
                            <div
                                className="profile-box"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <ProfileAnimation />
                            </div>
                            <div
                                className="profile-box"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '80px',
                                }}
                            >
                                <ProfileAnimation1 />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Account
