'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '../../Footer/footer'
import Navigation from '../../Navigation/page'
import PolicyCard from './policyCard'
import ClaimRequests from './claimRequests'
import ClaimsApproved from './claimApproved'

const HOST = 'http://localhost:3000'

const CompanyProfile = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userDataLoaded, setUserDataLoaded] = useState(false);
    const [isPoliciesVisible, setPoliciesVisible] = useState(true);
    const [isClaimRequestsVisible, setClaimRequestsVisible] = useState(false);
    const [isClaimsApprovedVisible, setClaimsApprovedVisible] = useState(false);
    const navigate = (location) => {
        router.push(location);
    }

    useEffect(() => {
        const checkCompany = async () => {
            const response = await fetch(`${HOST}/api/company/readprofile`, {
                method: 'GET',
                credentials: 'include',
            })

            if (response.status === 200) {
                let user = await response.json()
                console.log('Fetched user data:', user)

                if (user) {
                    setName(user.reply.name)
                    setPhone(user.reply.phone)
                    setEmail(user.reply.email)
                    setUsername(user.reply.username)
                    setUserDataLoaded(true)
                } else {
                    alert('User data is missing or invalid.')
                }
            } else {
                let error = await response.json()
                alert(error.error)
                navigate('/components/Account/companyRegistration')
            }
        }
        checkCompany()
    }, [])

    const handlePoliciesClick = () => {
        setPoliciesVisible(true);
        setClaimRequestsVisible(false);
        setClaimsApprovedVisible(false);
        navigate('/components/Account/addPolicy')
    };

    const handleClaimRequestsClick = () => {
        setPoliciesVisible(false);
        setClaimRequestsVisible(true);
        setClaimsApprovedVisible(false);
    };

    const handleClaimsApprovedClick = () => {
        setPoliciesVisible(false);
        setClaimRequestsVisible(false);
        setClaimsApprovedVisible(true);
    };

    const handleLogout = async (e) => {
        e.preventDefault()
        const result = await fetch(`${HOST}/api/company/logout`, {
            method: 'GET',
            credentials: 'include',
        })
        navigate('/components/Account')
    }

    return (
        <>
            <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen"
                style={{ overflowY: 'hidden', height: '100%', margin: '0', padding: '0' }}>
                <style jsx global>{`html, body { overflow: hidden; height: 100%; margin: 0; padding: 0;}`}</style>
                <Navigation />
                <div className="flex items-center justify-end pt-5">
                    <button
                        onClick={() => navigate('/')}
                        className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus-shadow-outline hover-bg-slate-900"
                    >
                        <b>Home</b>
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4 min-h-screen px-10 py-10">
                    <div className="..." style={{ height: '70vh' }}>
                        <div className="w-full max-w-sm min-h-full bg-white border border-gray-200 rounded-lg shadow dark-bg-gray-800 dark-border-gray-700">
                            <div className="flex flex-col items-center pb-10 pt-20">
                                <img
                                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                                    src="/Images/pic.jpeg"
                                    alt=""
                                />
                                {userDataLoaded ? (
                                    <>
                                        <h5 className="mb-1 text-xl font-medium text-gray-900">
                                            Hello, {name}
                                        </h5>
                                        <h3 className="mb-1 text-xl font-medium text-gray-800">
                                            Email: {email}
                                        </h3>
                                        <h3 className="mb-1 text-xl font-medium text-gray-800">
                                            Mobile: {phone}
                                        </h3>
                                    </>
                                ) : (
                                    <p>Loading user data...</p>
                                )}
                            </div>
                            <div className="flex items-center justify-center pt-5">
                                <button
                                    onClick={handlePoliciesClick}
                                    className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover-bg-slate-900"
                                >
                                    <b>Add Policy</b>
                                </button>
                            </div>
                            <div className="flex items-center justify-center pt-5">
                                <button
                                    onClick={handleClaimRequestsClick}
                                    className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover-bg-slate-900"
                                >
                                    <b>Claim Requests</b>
                                </button>
                            </div>
                            <div className="flex items-center justify-center pt-5">
                                <button
                                    onClick={handleClaimsApprovedClick}
                                    className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover-bg-slate-900"
                                >
                                    <b>Claim Approved</b>
                                </button>
                            </div>
                            <div className="flex items-center justify-center pt-5">
                                <button
                                    onClick={(e) => handleLogout(e)}
                                    className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus-shadow-outline hover-bg-slate-900"
                                >
                                    <b>Logout</b>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="col-span-2 ... bar"
                        style={{
                            border: '2px solid white',
                            height: '70vh',
                            overflow: 'auto',
                        }}
                    >
                        {isPoliciesVisible && <PolicyCard />}
                        {isClaimRequestsVisible && <ClaimRequests company={username} />}
                        {isClaimsApprovedVisible && <ClaimsApproved />}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default CompanyProfile;
