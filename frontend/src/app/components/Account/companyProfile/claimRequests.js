'use client'
import React, { useState, useEffect } from 'react';
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page';
import { ImCross } from 'react-icons/im';
import { motion } from 'framer-motion';

const HOST = 'http://localhost:3000';

const ClaimRequests = ( { company,balance }) => {
  const [claims, setClaims] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [refundValue, setRefundValue] = useState();
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedCompanyname, setSelectedCompanyname] = useState('');
  const [selectedMappingId, setSelectedMappingId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${HOST}/api/company/claim/get`, {
          method: 'GET',
          credentials: 'include',
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log(data);
    
          // Check if data.reply exists before accessing its properties
          const filteredClaims = data.reply && data.reply.claims
            ? data.reply.claims.filter((claim) => claim.companyname === company)
            : [];
    
          setClaims(filteredClaims);
        } else {
          console.error('Failed to fetch claims data');
        }
      } catch (error) {
        console.error('Error fetching claims data', error);
      }
    };
     fetchData();
  }, [company]);


  const handleAccept = async (username, companyname, mappingid) => {
    setShowModal(true);
    setRefundValue('');
    setSelectedUsername(username); 
    setSelectedCompanyname(companyname);
    setSelectedMappingId(mappingid);
  }

  const handleSubmit = async () => {
    if (balance < refundValue) {
      alert(`Insufficient balance, please purchase at least ${refundValue} tokens`);
      return;
    }
    try {
      const response = await fetch(`${HOST}/api/company/claim/accept`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ insuredname: selectedUsername, mappingid: selectedMappingId, refund: String(refundValue) }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        window.location.reload();
      } else {
        console.error('Failed to accept the claim');
      }
    } catch (error) {
      console.error('Error accepting the claim', error);
    }

    // Close the modal after submitting
    setShowModal(false);
  };

  const handleReject = async (username, mappingid) => {
    try {
      const response = await fetch(`${HOST}/api/company/claim/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, mappingid })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        window.location.reload();
      } else {
        console.error('Failed to fetch claims data');
      }
    } catch (error) {
      console.error('Error fetching claims data', error);
    }
  }

  const handleClose = async() => {
    setShowModal(false);
  };

  return (
    <>
      <div className="main-card--container">
        {claims && claims.length > 0 ? (
          claims.map((claim) => {
            const {
              username,
              mappingid,
              policyid,
              assetid,
              premiumspaid,
              claimed,
              claimcause,
              companyname,
              docslinked,
              verifiedby,
              claimdate
            } = claim;

            const areButtonsDisabled = claimed === 'Approved' || claimed === 'Rejected';
            // Define a variable for conditional styling
            const buttonStyles = areButtonsDisabled
              ? { cursor: 'not-allowed', pointerEvents: 'none', opacity: 0.7 }
              : {};

            return (
              <div className="card-container" key={mappingid}>
                <div className="card">
                  <div className="card-body">
                    <span className="card-title mt-4" style={{ fontSize: '30px', fontWeight: 'bold' }}>Policy Id : {policyid}</span>
                    <hr style={{ border: '1px solid black', width: '70%', margin: 'auto 0' }} />
                    <table>
                      <tbody>
                        <tr>
                          <td><b>User Name : </b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{username}</td>
                        </tr>
                        <tr>
                          <td><b>Mapping Id : </b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{mappingid}</td>
                        </tr>
                        <tr>
                          <td><b>Asset Id : </b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{assetid}</td>
                        </tr>
                        <tr>
                          <td><b>Premiums Paid : </b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{premiumspaid}</td>
                        </tr>
                        <tr>
                          <td><b>Claimed : </b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{claimed}</td>
                        </tr>
                        <tr>
                          <td><b>Claim Cause : </b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{claimcause}</td>
                        </tr>
                        {claim.docslinked && claim.docslinked.length > 0 && (
                          <tr>
                            <td><b>Documents Linked : </b></td>
                            <td colSpan="3" style={{ paddingLeft: '20px' }}>
                              {claim.docslinked.map((docLink, index) => (
                                <span key={index}>
                                  <a href={docLink} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'cursive', color: 'rosybrown', fontWeight: 'bold'}}>
                                    Doc {index + 1}
                                  </a>
                                  {index < claim.docslinked.length - 1 && ', '}
                                </span>
                              ))}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td><b>Claim Date : </b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{claimdate}</td>
                        </tr>
                        <tr>
                          <td><b>Verified By : </b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{verifiedby}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <button
                      className="card-tag"
                      onClick={() => handleReject(username, mappingid)}
                      disabled={areButtonsDisabled}
                      style={buttonStyles}
                    >
                      Reject
                    </button>
                    <button
                      className="card-tag"
                      onClick={() => handleAccept(username, companyname, mappingid)}
                      disabled={areButtonsDisabled}
                      style={buttonStyles}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="grid grid-row-2 gap-20"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="text-white text-4xl p-5 pt-20" style={{ flex: '1 0 33%' }}>
              No claim requests to show up here
            </div>
            <div style={{ flex: '1' }}>
              <UserAddAssetAnimation />
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <>
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-60 z-100"
          onClick={handleClose}
        ></div>

        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
          className="fixed bottom-1/4 right-1/3 w-96 h-72 bg-slate-100 drop-shadow-md flex flex-col z-[101] rounded-xl"
        >
          <div className="w-full flex items-center justify-end p-4 cursor-pointer">
            <p>   </p>
            <p className="text-black text-lg font-semibold"></p>

            <motion.p
              whileTap={{ scale: 0.75 }}
              className="flex items-center gap-2 p-1 px-2 my-2 bg-gray-200 rounded-md hover:shadow-xl hover:bg-grey-500 cursor-pointer text-textColor text-base"
              onClick={handleClose}
            >
              <ImCross />
            </motion.p>
          </div>
          <div className="w-full h-1/2 rounded-t-[2rem] flex flex-col items-center justify-center px-8 py-2">
            <p className="text-gray-800 text-lg font-semibold">
              <b>Enter refund amount : </b>
            </p>
            <input
              type="number"
              value={refundValue}
              onChange={(e) => setRefundValue(e.target.value)}
              placeholder='0'
              className="w-48 px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              className="h-10 px-6 mt-5 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900" 
              onClick={handleSubmit}>Submit</button>
          </div>
        </motion.div>
      </>
    )}
    </>
  );
};

export default ClaimRequests;