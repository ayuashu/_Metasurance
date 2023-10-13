"use client"
import Link from 'next/link'
import React from 'react'
import {useRouter} from  'next/navigation'
import Footer from '../../Footer/footer'
import Navigation from '../../Navigation/page'

const CompanyProfile = () => {
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
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Company name</h5>
                    <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white">Email id</h3>
                </div>
            </div>
          </div>
          <div className="col-span-2 ...">
              <div className="flex items-center justify-end pt-5">
                <button
                  onClick={() => navigate('/')}
                  className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900">
                      <b>Home</b>   
                </button>    
              </div>
            </div>  
          </div>
       <Footer/> 
      </div>
    </>
  )
}

export default CompanyProfile
