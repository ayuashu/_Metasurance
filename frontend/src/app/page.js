"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import PolicyAnimation from './components/PolicyAnimation/PolicyAnimation'
import Video from './components/Video/page'
import Navigation from './components/Navigation/page'
import Footer from './components/Footer/footer'


const Page = () => {
  const router = useRouter()
  const navigate = (location) => {
    router.push(location)
  }

  return (
    <>
      <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen">
      <Navigation />
        <div className="boxcontainer mx-auto p-4 flex flex-row flex-wrap" style={{height: '90vh'}}>
          <div className="basis-1/3 flex flex-col justify-between items-center">
            <div style={{paddingTop: '100px'}}>
              <PolicyAnimation />
            </div>
          </div>
          
          <div className="basis-1/3">
          <div className='w-full' style={{paddingTop: '150px'}}>
              <h1 className="text-5xl text-center text-indigo-100" >Welcome to</h1> 
              <h1 className="text-[80px] text-center text-indigo-100"><b>METASURANCE</b></h1>
              <div className="md:w-96 lg:w-fit mt-16 mx-auto text-2xl text-indigo-300">ALONG META, ALONG YOU</div>
              <div className="md:w-96 lg:w-fit mt-2 mx-auto text-2xl text-indigo-300">BEYOND META, BEYOND YOU</div>
            </div>
          </div>
          
          <div className='basis-1/3 flex flex-col p-5 w-full'>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate('/components/registration/userRegistration')}
                className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900">
                    <b>User</b>   
              </button>
              <button
                onClick={() => navigate('/components/registration/companyRegistration')}
                className="h-10 px-7 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900">
                <b>Company</b>
              </button>
            </div>
            <div className="p-10 mt-auto w-full ">
                <Video />
            </div>  
          </div>
        
        </div>
        <Footer />       
      </div>
    </>
  )
}
export default Page