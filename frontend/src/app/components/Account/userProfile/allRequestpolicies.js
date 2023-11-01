import React, { useEffect, useState, useRef } from 'react';

const HOST = "http://localhost:3000";

const AllRequestPolicyCard = ({ assetid, rendered }) => {
    const [policyCompanies, setPolicyCompanies] = useState([]);
    const cardRef = useRef(null);

    const handleRequestPolicy = async (assetid, policyid) => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/request`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    policyid,
                    assetid,
                }),
            });
            if (response.ok) {
                // Successfully purchased the policy, you can handle the response or perform any necessary action.
                console.log('Policy purchase was successful');
            } else {
                console.error('Failed to purchase policy');
            }
        } catch (error) {
            console.error('Error purchasing policy', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (rendered) {
                    // Fetch data only if the component has been rendered
                    const response = await fetch(`${HOST}/api/user/policy/viewall`, {
                        method: "GET",
                        credentials: "include",
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setPolicyCompanies(data.reply.policyCompanies);
                        console.log(data); // Log the data
                    } else {
                        console.error('Failed to fetch policy data');
                    }
                }
            } catch (error) {
                console.error('Error fetching policy data', error);
            }
        };

        fetchData(); // Call the fetchData function when the component mounts
    }, [rendered]);

    return (
        <div className="main-card-container">
            {policyCompanies.map((company) => {
                const { companyName, policies } = company;

                return (
                    <div key={companyName}>
                        {policies.map((policy) => {
                            const { policyid, policyname, insurancetype, premiumamount, insurancecover } = policy;

                            const policyId = `policy-${policyid}`;

                            return (
                                <div className="card-container" style={{marginLeft: '100px', marginRight: '100px', border: '2px solid wheat'}} key={policyId}>
                                    <div className="card" style={{backgroundColor:'black', color: 'wheat'}} ref={cardRef}>
                                        <div className="card-body">
                                            <span className="card-title" style={{fontSize: '40px'}}>{policyname}</span>
                                            <span className="card-author">{companyName}</span>
                                            <ul>
                                                <li><b>Insurance Type:</b> {insurancetype}</li>
                                                <li><b>Insurance Cover:</b> {insurancecover}</li>
                                                <li><b>Premium Amount:</b> {premiumamount}</li>
                                            </ul>
                                            </div>
                                            <div>
                                                <button className='card-tag' onClick={() => handleRequestPolicy(assetid , policyid)}>Purchase</button>
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
};

export default AllRequestPolicyCard;
