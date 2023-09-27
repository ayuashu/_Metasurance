"use client"
import React from 'react'
import Link from 'next/link'
import Navigation from '../Navigation/page';
import Footer from '../Footer/footer';

const page = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <Navigation/>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Policy Management
            </h2>
            <div className="flex flex-col space-y-4">
              <Link
                href="/policy/createpolicy"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center"
              >
                Create Policy
              </Link>
              <Link
                href="/policy/viewpolicy"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-center"
              >
                List Policies
              </Link>
              {/* add a button to go back */}
              <Link
                href="/"
                className="bg-amber-500 hover:bg-amber-600 text-black py-2 px-4 rounded-lg text-center"
              >
                Go Back
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
      </div>
      </>
  );
};

export default page