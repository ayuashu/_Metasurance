import React, { useState, useEffect } from 'react';
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page';

const HOST = 'http://localhost:3000';

const ClaimsApproved = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${HOST}/api/company/claim/approved`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setClaims(data.reply);
        } else {
          console.error('Failed to fetch claims data');
        }
      } catch (error) {
        console.error('Error fetching claims data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="main-card--container">
        {claims && claims.length > 0 ? (
          claims.map((claim) => {
            const {
              mappingid,
              policyid,
              assetid,
              premiumspaid,
              claimed,
              claimcause,
              username,
              verifiedby
            } = claim;

            return (
              <div className="card-container" key={mappingid}>
                <div className="card">
                  <div className="card-body">
                    <span className="card-title mt-4" style={{ fontSize: '30px', fontWeight: 'bold' }}>Policy Id : {policyid}</span>
                    <hr style={{ border: '1px solid black' }} />
                    <table>
                      <tbody>
                        <tr>
                          <td><b>Claimed By : </b></td>
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
                        <tr>
                          <td><b>Verified By : </b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{verifiedby}</td>
                        </tr>
                      </tbody>
                    </table>
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
              No claims approved yet
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

export default ClaimsApproved;





