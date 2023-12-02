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
          
          <div className='basis-1/3 flex flex-col w-full'>
            <div className="flex items-center justify-end pr-20">
              <a href="/" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" id="user-account" fill="white" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20"><g>
                  <path d="M12 4c1.7 0 3 1.3 3 3s-1.3 3-3 3S9 8.7 9 7 10.3 4 12 4M12 2C9.2 2 7 4.2 7 7s2.2 5 5 5 5-2.2 5-5S14.8 2 12 2L12 2zM19 22c-.4 0-.8-.3-1-.7l-1-3.4C16.6 16.2 15 15 13.2 15h-2.5c-1.8 0-3.4 1.2-3.8 2.9l-1 3.4c-.2.5-.7.8-1.2.7-.5-.2-.8-.7-.7-1.2l1-3.4c.7-2.6 3.1-4.4 5.8-4.4h2.5c2.7 0 5 1.8 5.8 4.4l1 3.4c.2.5-.2 1.1-.7 1.2C19.2 22 19.1 22 19 22z"></path>
                  </g>
                </svg>
              </a>
            </div>
            <div className="flex items-center justify-end pr-9">
              <button
                onClick={() => navigate('/components/Account')}
                className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-500 rounded-full focus:shadow-outline hover:bg-slate-900">
                    <b>Welcome</b>   
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