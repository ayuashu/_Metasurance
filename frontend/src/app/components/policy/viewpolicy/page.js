"use client"
import Footer from '@/app/components/Footer/footer';
import Navigation from '@/app/components/Navigation/page';
import React, { useState, useEffect } from 'react';

const PolicyViewer = () => {
  const [policies, setPolicies] = useState([]);

  // Simulated data for existing policies
  const samplePolicies = [
    {
      id: 1,
      title: 'Auto Insurance Policy',
      description: 'Coverage for your vehicle.',
      thumbnail: 'https://w7.pngwing.com/pngs/716/176/png-transparent-insurance-agent-health-insurance-life-insurance-vehicle-insurance-business-service-people-logo-thumbnail.png', // Replace with actual image paths
    },
    {
      id: 2,
      title: 'Home Insurance Policy',
      description: 'Protection for your home and belongings.',
      thumbnail: 'https://e7.pngegg.com/pngimages/939/452/png-clipart-life-insurance-health-insurance-child-dental-insurance-icon-saving-blue-thumbnail.png', // Replace with actual image paths
    },
    {
      id: 3,
      title: 'Health Insurance Policy',
      description: 'Medical coverage for you and your family.',
      thumbnail: 'https://w7.pngwing.com/pngs/400/750/png-transparent-health-insurance-health-care-life-insurance-others-blue-logo-insurance-thumbnail.png', // Replace with actual image paths
    },
  ];

  useEffect(() => {
    // Simulated API call to fetch policies (replace with actual API call)
    setPolicies(samplePolicies);
  }, []);

  return (
    <>
    <Navigation />
    <div className="min-h-screen bg-slate-700 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              All Policies
            </h2>
            {policies.length === 0 ? (
              <p className="text-gray-600">No policies available.</p>
            ) : (
              <ul className="space-y-4">
                {policies.map((policy) => (
                  <li key={policy.id}>
                    <div className="border rounded-lg p-4 flex flex-wrap items-center space-x-4">
                      <img
                        src={policy.thumbnail}
                        alt={`${policy.title} Thumbnail`}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {policy.title}
                        </h3>
                        <p className="text-gray-600">{policy.description}</p>
                      </div>
                    <div className="mt-6">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none">
                        Get Policy
                        </button>
                    </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer/>
      </div>
      </>
  );
};

export default PolicyViewer;
