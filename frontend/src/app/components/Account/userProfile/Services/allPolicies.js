import React, { useEffect, useState } from 'react';

const HOST = 'http://localhost:3000';

const AllPolicyCard = ({ selectedInsuranceType, selectedCompanyName }) => {
  const [policyCompanies, setPolicyCompanies] = useState([]);
  const [filteredPolicyCompanies, setFilteredPolicyCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${HOST}/api/user/policy/viewall`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();

          // Check if the expected properties are present in the data
          if (data.reply && data.reply.policyCompanies) {
            setPolicyCompanies(data.reply.policyCompanies);
          } else {
            console.error('Invalid data format');
          }
        } else {
          console.error('Failed to fetch policy data');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching policy data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('Selected Insurance Type:', selectedInsuranceType);
    console.log('Selected Company Name:', selectedCompanyName);
  
    // Filter policy companies based on selectedInsuranceType
    const filteredByInsuranceType = selectedInsuranceType
      ? policyCompanies.filter((company) =>
          company.policies.some((policy) => policy.insurancetype === selectedInsuranceType)
        )
      : policyCompanies;
  
    console.log('Companies after filtering by Insurance Type:', filteredByInsuranceType);
  
    // Filter policies within each company based on selectedInsuranceType
    const filteredPoliciesByInsuranceType = selectedInsuranceType
      ? filteredByInsuranceType.map((company) => ({
          ...company,
          policies: company.policies.filter((policy) => policy.insurancetype === selectedInsuranceType),
        }))
      : filteredByInsuranceType;
  
    console.log('Policies after filtering by Insurance Type:', filteredPoliciesByInsuranceType);
  
    // Filter policy companies based on selectedCompanyName
    const filteredByCompanyName = selectedCompanyName
      ? filteredPoliciesByInsuranceType.filter((company) => company.companyName === selectedCompanyName)
      : filteredPoliciesByInsuranceType;
  
    console.log('Companies after filtering by Company Name:', filteredByCompanyName);
  
    // Set the filtered companies to the state
    setFilteredPolicyCompanies(filteredByCompanyName);
  }, [selectedInsuranceType, selectedCompanyName, policyCompanies]);
  
  

  return (
    <div className="main-card-container">
      {filteredPolicyCompanies.length === 0 && (
        <div className="text-white text-6xl p-5 pt-20" style={{ flex: '1 0 33%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          No policy yet available!!!
        </div>
      )}

      {filteredPolicyCompanies.map(({ companyName, policies }) => (
        <div key={companyName}>
          {policies.map((policy) => {
            const {
              policyid,
              policyname,
              insurancetype,
              premiumamount,
              insurancecover,
              claimsperyear
            } = policy;

            const policyId = `policy-${policyid}`;

            return (
              <div className="card-container" key={policyId}>
                <div className="card">
                  <div className="card-body">
                    <span className="card-title">{policyname}</span>
                    <hr
                      style={{
                        border: '1px solid black',
                        width: '70%',
                        margin: 'auto 0',
                      }}
                    />
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
                        <tr>
                          <td><b>Claims per Year:</b></td>
                          <td colSpan="3" style={{ paddingLeft: '20px' }}>{claimsperyear}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AllPolicyCard;
