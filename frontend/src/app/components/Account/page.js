"use client"
import Link from 'next/link'
import React from 'react'
import {useRouter} from  'next/navigation'
import Navigation from '../Navigation/page'
import Footer from '../Footer/footer'

const Account = () => {
  const router = useRouter()
  const navigate = (location) => {
      router.push(location)
  }

  return (
    <>
    <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen" >
      <Navigation/>
        <div className="grid grid-cols-3 gap-4 min-h-screen px-10 py-10">
          <div className="..." style={{height: '80vh'}}>
            <div className="w-full max-w-sm min-h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col items-center pb-10 pt-20">
                  <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/Images/pic.jpeg" alt=""/>  
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">!!!Hurray!!!</h5>
                    <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white">Time to Explore</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">User/Company</span>
                </div>
            </div>
          </div>
          <div className="col-span-2 ...">
              <div className="flex items-center justify-end pt-5">
                <button
                  onClick={() => navigate('/components/Account/userRegistration')}
                  className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900">
                      <b>Use Service</b>   
                </button>
                <button
                  onClick={() => navigate('/components/Account/companyRegistration')}
                  className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900">
                      <b>Give Service</b>   
                </button>      
              </div>
            </div>  
          </div>
       <Footer/> 
      </div>
    </>
  )
}

export default Account
