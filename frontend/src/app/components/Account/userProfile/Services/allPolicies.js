import React, { useEffect, useState } from 'react';
import AllAssetCard from '../allAssetCard';

const HOST = 'http://localhost:3000';

const AllPolicyCard = ({ selectedInsuranceType, selectedCompanyName }) => {
  const [policyCompanies, setPolicyCompanies] = useState([]);
  const [filteredPolicyCompanies, setFilteredPolicyCompanies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${HOST}/api/user/policy/viewall`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPolicyCompanies(data.reply.policyCompanies);
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

  useEffect(() => {
    // Filter policy companies based on selectedInsuranceType and selectedCompanyName
    if (selectedInsuranceType || selectedCompanyName) {
      const filteredCompanies = policyCompanies.filter((company) => {
        const policies = company.policies;
        return policies.some(
          (policy) =>
            (!selectedInsuranceType || policy.insurancetype === selectedInsuranceType) &&
            (!selectedCompanyName || company.companyName === selectedCompanyName)
        );
      });
      setFilteredPolicyCompanies(filteredCompanies);
    } else {
      // If no filters are selected, show all policy companies
      setFilteredPolicyCompanies(policyCompanies);
    }
  }, [selectedInsuranceType, selectedCompanyName, policyCompanies]);

  const toggleAssetDisplay = (policyId) => {
    setSelectedPolicyId((prevSelectedPolicyId) => {
      if(prevSelectedPolicyId === policyId) {
        return null;
      } else {
        return policyId;
      }
    });
  }
  
  return (
    <div className="main-card-container">
      {filteredPolicyCompanies.map((company) => {
        const { companyName, policies } = company;
        return (
          <div key={companyName}>
            {policies.map((policy) => {
              const {policyid,policyname,insurancetype,premiumamount,insurancecover} = policy;
              const policyId = `policy-${policyid}`;
              const isAssetVisible = selectedPolicyId === policyId;
              return (
                <div className="card-container" key={policyId}>
                  <div className="card">
                    <div className="card-body">
                      <span className="card-title">{policyname}</span>
                      <span className="card-author">{companyName}</span>
                      <table>
                        <tbody> 
                          <tr>
                            <td><b>Insurance Type:</b></td>
                            <td colSpan="3" style={{ paddingLeft: '20px' }}>{insurancetype}</td>
                          </tr>
                          <tr>
                            <td><b>Insurance Cover:</b></td>
                            <td colSpan="3" style={{ paddingLeft: '20px' }}>{insurancecover}</td>
                          </tr>
                          <tr>
                            <td><b>Premium Amount:</b></td>
                            <td colSpan="3" style={{ paddingLeft: '20px' }}>{premiumamount}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <button className="card-tag" onClick={() => toggleAssetDisplay(policyId)}>
                        {isAssetVisible ? 'Hide Assets' : 'Show Assets'}
                      </button>
                    </div>
                  </div>
                  {isAssetVisible && (
                    <AllAssetCard
                      // policyId={policyId}
                      // policyName={policyname}
                      // rendered={true}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default AllPolicyCard;
