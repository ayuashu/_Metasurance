"use client"
import Footer from '@/app/components/Footer/footer';
import Navigation from '@/app/components/Navigation/page';
import React, { useState } from 'react';

const PolicyWebsite = () => {
  const [policies, setPolicies] = useState([]);
  const [policyTitle, setPolicyTitle] = useState('');
  const [policyDescription, setPolicyDescription] = useState('');

  const handleCreatePolicy = () => {
    if (policyTitle && policyDescription) {
      const newPolicy = {
        id: policies.length + 1,
        title: policyTitle,
        description: policyDescription,
      };

      setPolicies([...policies, newPolicy]);
      setPolicyTitle('');
      setPolicyDescription('');
    }
  };

  return (
    <>
    <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen">
      <Navigation />
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:min-w-xl sm:mx-auto lg:min-w-[500px]">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <h1 className='text-3xl'>Create Policy</h1>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">{policyTitle}</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  {policyDescription}
                </p>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex items-center justify-between space-y-5 flex-col">
                  <div className="flex flex-col min-w-full">
                    <label className="leading-loose">Policy Title</label>
                    <input
                      type="text"
                      placeholder="Enter policy title"
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                      value={policyTitle}
                      onChange={(e) => setPolicyTitle(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col min-w-full">
                    <label className="leading-loose">Policy Description</label>
                    <textarea
                      rows="4"
                      placeholder="Enter policy description"
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                      value={policyDescription}
                      onChange={(e) => setPolicyDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex flex-col min-w-full">
                    <label className="leading-loose">Policy Premuim(in Rupees)</label>
                    <input
                      placeholder="Enter policy premium"
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    ></input>
                  </div>
                  <div className="flex flex-col min-w-full">
                    <label className="leading-loose">Insurance cover(in Rupees)</label>
                    <input
                      placeholder="Enter policy premium"
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    ></input>
                  </div>
                  <div className="flex flex-col min-w-full"> {/*change it to radio button*/}
                    <label className="leading-loose">Insurance type</label>
                    <input
                      placeholder="Enter policy premium"
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    ></input>
                  </div>
                  <div className="flex flex-col min-w-full"> {/*change it to radio button*/}
                    <label className="leading-loose">Insurance duration</label>
                    <input
                      placeholder="Enter policy premium"
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    ></input>
                  </div>
                </div>
                <div className="pt-4 flex items-center space-x-4">
                  <button
                    className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-lg focus:outline-none hover:bg-blue-600"
                    onClick={handleCreatePolicy}
                  >
                    Create Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer/>
      </div>
      </>
  );
};

export default PolicyWebsite;
