"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../Footer/footer';
import Navigation from '../../../Navigation/page';
import AllPolicyCard from './allPolicies';

const HOST = "http://localhost:3000";

const Services = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);

  const navigate = (location) => {
    router.push(location);
  }

  useEffect(() => {
    const checkUser = async () => {
      const response = await fetch(`${HOST}/api/user/readprofile`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        let user = await response.json();
        console.log("Fetched user data:", user);

        if (user) {
          setName(user.reply.name);
          setPhone(user.reply.phone);
          setEmail(user.reply.email);
          setUserDataLoaded(true);
        } else {
          alert("User data is missing or invalid.");
        }
      } else {
        let error = await response.json();
        alert(error.error);
        navigate('/components/Account/userRegistration');
      }
    }

    checkUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${HOST}/api/user/policy/viewall`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setInsuranceTypes(getUniqueInsuranceTypes(data.reply.policyCompanies));
          setCompanyNames(getUniqueCompanyNames(data.reply.policyCompanies));
          console.log('Fetched data:', data);
        } else {
          console.error('Failed to fetch policy data');
        }
      } catch (error) {
        console.error('Error fetching policy data', error);
      }
    }

    fetchData();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    const result = await fetch(`${HOST}/api/user/logout`, {
      method: 'GET',
    });
    navigate('/');
  }

  const getUniqueInsuranceTypes = (policyCompanies) => {
    const uniqueTypes = new Set();
  
    if (policyCompanies) {
      policyCompanies.forEach((company) => {
        if (company.policies) {
          company.policies.forEach((policy) => {
            uniqueTypes.add(policy.insurancetype);
          });
        }
      });
    }
    return [...uniqueTypes];
  };
  
  
  const getUniqueCompanyNames = (policyCompanies) => {
    const uniqueNames = new Set();
  
    if (policyCompanies) {
      policyCompanies.forEach((company) => {
        if (company.companyName) {
          uniqueNames.add(company.companyName);
        }
      });
    }
    return [...uniqueNames];
  };
  

  return (
    <>
      <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen"
        style={{ overflowY: 'hidden', height: '100%', margin: '0', padding: '0' }}>
        <style jsx global>{`html, body { overflow: hidden; height: 100%; margin: 0; padding: 0;}`}</style>
        <Navigation />
        <div className="flex items-center justify-end space-x-4 p-4">
          <div className="relative">
            <label htmlFor="insuranceType" className="text-white p-2">
              <b>Insurance Type</b>
            </label>
            <select
              id="insuranceType"
              value={selectedInsuranceType}
              onChange={(e) => setSelectedInsuranceType(e.target.value)}
              className="form-select text-slate-50 text-sm bg-neutral-950 rounded-full focus:shadow-outline hover-bg-slate-200 uppercase"
              style={{
                padding: '0.5rem 2rem 0.5rem 1rem',
                minWidth: '150px',
                fontWeight: 'bold'
              }}
            >
              <option value="">All</option>
              {insuranceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label htmlFor="companyName" className="text-white p-2">
              <b>Company Name</b>
            </label>
            <select
              id="companyName"
              value={selectedCompanyName}
              onChange={(e) => setSelectedCompanyName(e.target.value)}
              className="form-select text-slate-50 text-sm bg-neutral-950 rounded-full focus:shadow-outline hover-bg-slate-200 uppercase"
              style={{
                padding: '0.5rem 2rem 0.5rem 1rem',
                minWidth: '150px',
                fontWeight: 'bold',
              }}
            >
              <option value="">All</option>
              {companyNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr
          className="w-60 ml-auto border-t border-white"
        />
        <div className="grid grid-cols-3 gap-4 min-h-screen px-10 py-10">
          <div className="..." style={{ height: '70vh' }}>
            <div className="w-full max-w-sm min-h-full bg-slate-900 border border-gray-200 rounded-lg shadow ">
              <div className="flex flex-col items-center pb-10 pt-20">
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/Images/pic.jpeg" alt="" />
                {userDataLoaded ? (
                  <>
                    <h5 className="mb-1 text-xl font-medium text-white">Hello, {name}</h5>
                    <h3 className="mb-1 text-xl font-medium text-white">Email: {email}</h3>
                    <h3 className="mb-1 text-xl font-medium text-white">Mobile: {phone}</h3>
                  </>
                ) : (
                  <p>Loading user data...</p>
                )}
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => navigate('/components/Account/userProfile')}
                  className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900">
                  <b>Profile</b>
                </button>
              </div>

              {/* logout button */}
              <div className="flex items-center justify-center pt-5">
                <button
                  onClick={(e) => handleLogout(e)}
                  className="h-10 px-11 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover-bg-slate-900">
                  <b>Logout</b>
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-2 ... bar" style={{ border: "2px solid white", height: '70vh', overflow: 'auto' }}>
            <AllPolicyCard selectedInsuranceType={selectedInsuranceType} selectedCompanyName={selectedCompanyName} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Services;