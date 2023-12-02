import React, { useState, useEffect } from 'react';
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page';

const HOST = 'http://localhost:3000';

const ClaimRequests = () => {
  const [claims, setClaims] = useState([]);

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
          setClaims(data.reply.claims);
        } else {
          console.error('Failed to fetch claims data');
        }
      } catch (error) {
        console.error('Error fetching claims data', error);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (username, mappingid) => {
    try {
      const response = await fetch(`${HOST}/api/company/claim/accept`, {
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
              docslinked,
              verifiedby,
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
                    <hr style={{ border: '1px solid black' }} />
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
                      onClick={() => handleAccept(username, mappingid)}
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
              Add claim requests to show up here
            </div>
            <div style={{ flex: '1' }}>
              <UserAddAssetAnimation />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClaimRequests;





