'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '../../Footer/footer'
import Navigation from '../../Navigation/page'
import AssetCard from './assetCard'
import PolicyIssued from './policyIssued'
import PurchaseToken from './token'
import Services from './Services/page'
import Backdrop from '../../assets/Backdrop/page'
import { motion } from 'framer-motion'
import { ImCross } from 'react-icons/im'

const HOST = 'http://localhost:3000'

const UserProfile = () => {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [balance, setBalance] = useState('')
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const [viewPolicies, setViewPolicies] = useState(false)
    const [purchaseModal, setPurchaseModal] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const navigate = (location) => {
        router.push(location)
    }

    useEffect(() => {
        const checkUser = async () => {
            const response = await fetch(`${HOST}/api/user/readprofile`, {
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
                    setBalance(parseInt(user.reply.balance,10))
                    setUserDataLoaded(true)
                } else {
                    alert('User data is missing or invalid.')
                }
            } else {
                let error = await response.json()
                alert(error.error)
                navigate('/components/Account/userRegistration')
            }
        }
        checkUser()
    }, [])

    const handleLogout = async (e) => {
        e.preventDefault()
        const result = await fetch(`${HOST}/api/user/logout`, {
            method: 'GET',
            credentials: 'include',
        })
        navigate('/components/Account')
    }

    const handleViewPolicies = () => {
        setViewPolicies((prevViewPolicies) => !prevViewPolicies)
    }

    const handlePurchaseToken = (balance) => async (e) => {
        setPurchaseModal(true)
    }

    const handleBalanceUpdate = (updatedBalance) => {
        setBalance(updatedBalance);
    };

    const handleDisplay = () => {
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
    }   

    return (
        <>
            <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen"
                style={{ overflowY: 'hidden', height: '100%', margin: '0', padding: '0' }}>
                <style jsx global>{`html, body { overflow: hidden; height: 100%; margin: 0; padding: 0;}`}</style>
                <Navigation />
                <div className="flex items-center justify-end gap-1 pt-5 pr-5">
                    <button
                        onClick={() => navigate('/')}
                        className="h-11 px-8 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus-shadow-outline hover:bg-slate-900"
                    >
                        <b>Home</b>
                    </button>
                    <button
                        onClick={(e) => handleLogout(e)}
                        className="h-11 px-8 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus-shadow-outline hover:bg-slate-900"
                    >
                        <b>Logout</b>
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4 min-h-screen px-10 py-10">
                    <div className="..." style={{ height: '70vh' }}>
                        <div className="w-full max-w-sm min-h-full bg-white border border-gray-200 rounded-lg shadow ">
                            <div className="flex flex-col items-center pb-10 pt-20">
                                <img
                                    className="w-24 h-24 mb-3 rounded-full shadow-xl"
                                    src="/Images/pic.jpeg"
                                    alt=""
                                />
                                {userDataLoaded ? (
                                    <>
                                        <h5 className="mb-1 text-xl font-semibold text-gray-900">
                                            Hello, {name}
                                        </h5>
                                        <h3 className="mb-1 text-lg font-medium text-gray-800">
                                            Email: <b>{email}</b>
                                        </h3>
                                        <h3 className="text-lg font-medium text-gray-800">
                                            Mobile: <b>{phone}</b>
                                        </h3>
                                        <h3 className="text-lg font-medium text-gray-800">
                                            Balance: <b>{parseInt(balance,10)}</b>
                                        </h3>
                                    </>
                                ) : (
                                    <p>Loading user data...</p>
                                )}
                            </div>
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={handleDisplay}
                                    className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900"
                                >
                                    <b>Services</b>
                                </button>
                            </div>
                            <div className="flex items-center justify-center pt-3">
                                <button
                                    onClick={handlePurchaseToken(balance)}
                                    className="h-10 px-6 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900"
                                >
                                    <b>Purchase Token</b>
                                </button>
                            </div>
                            <div className="flex items-center justify-center pt-3">
                                <button
                                    onClick={() => navigate('/components/Account/addAsset')}
                                    className="h-10 px-8 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover-bg-slate-900"
                                >
                                    <b>Add Products</b>
                                </button>
                            </div>
                            <div className="flex items-center justify-center pt-3">
                                <button
                                    onClick={handleViewPolicies}
                                    className="h-10 px-8 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover-bg-slate-900"
                                >
                                    <b>
                                        {viewPolicies
                                            ? 'View Assets'
                                            : 'Issued Policies'}
                                    </b>
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
                        {viewPolicies ? (
                            <PolicyIssued username={username} balance={balance} />
                        ) : (
                            <AssetCard balance={balance}/>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
            {purchaseModal && <PurchaseToken username={username} amount={balance} onBalanceUpdate={handleBalanceUpdate} isModal={setPurchaseModal} />}
            {showModal && (
                <>
                    <Backdrop onClick={handleClose} />
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-black opacity-60 z-100"
                        onClick={handleClose}
                    ></div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-40 right-1/4 bg-slate-900 drop-shadow-md flex flex-col z-[101] rounded-xl overflow-hidden"
                        style={{ maxHeight: '70vh', width: '60vw' }}
                    >
                        <div className="w-full flex items-center justify-end p-4 cursor-pointer">
                            <p></p>
                            <p className="text-black text-lg font-semibold"></p>

                            <motion.p
                                whileTap={{ scale: 0.75 }}
                                className="flex items-center gap-2 p-1 px-2 my-2 bg-gray-200 rounded-md hover:shadow-xl hover:bg-grey-500 cursor-pointer text-textColor text-base"
                                onClick={handleClose}
                            >
                                <ImCross />
                            </motion.p>
                        </div>
                        <div className="w-full flex flex-col overflow-y-auto py-5 px-32">
                            <Services />
                        </div>
                    </motion.div>
                </>
            )}
        </>
    )
}

export default UserProfile