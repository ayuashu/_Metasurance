import React, { useEffect, useState } from 'react';

const HOST = 'http://localhost:3000';

const AllPolicyCard = ({ selectedInsuranceType, selectedCompanyName }) => {
  const [policyCompanies, setPolicyCompanies] = useState([]);
  const [filteredPolicyCompanies, setFilteredPolicyCompanies] = useState([]);

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

  return (
    <div className="main-card-container">
      {filteredPolicyCompanies.map((company) => {
        const { companyName, policies } = company;
        return (
          <div key={companyName}>
            {policies.map((policy) => {
              const {
                policyid,
                policyname,
                insurancetype,
                premiumamount,
                insurancecover,
              } = policy;

              const policyId = `policy-${policyid}`;

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
                  </div>
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
