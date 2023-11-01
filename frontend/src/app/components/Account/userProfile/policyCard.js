import React, { useEffect, useState, useRef } from 'react';

const HOST = "http://localhost:3000";

const handlePayPremium = async (policyid) => {
    try {
        const response = await fetch(`${HOST}/api/user/policy/paypremium`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mappingid: policyid }),
        });
        if (response.ok) {
            console.log('Payment was successful');
        } else {
            console.error('Failed to pay');
        }
    } catch (error) {
        console.error('Error in transaction', error);
    }
};

const handleClaim = async (policyid) => {
    try {
        const response = await fetch(`${HOST}/api/user/policy/claim`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mappingid: policyid }),
        });
        if (response.ok) {
            console.log('Claim request was successful');
            // Disable the claim button for the policy
            setDisabledClaims((prevDisabledClaims) => ({
                ...prevDisabledClaims,
                [policyid]: true,
            }));
        } else {
            console.error('Failed to make a claim');
        }
    } catch (error) {
        console.error('Error in claim transaction', error);
    }
};


const PolicyCard = ({ rendered }) => {
    const [policies, setPolicies] = useState([]);
    const cardRef = useRef(null);

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
                        setPolicies(data.reply.policies);
                        console.log(data);
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
            {policies.map((policy) => {
                const { policyid, policyName, companyName, insuranceType, premiumAmount, insuranceCover } = policy;

                const policyId = `policy-${policyid}`;

                return (
                    <div className="card-container" key={policyId}>
                        <div className="card" ref={cardRef}>
                            <div className="card-body">
                                <span className="card-title">{policyName}</span>
                                <span className="card-author">{companyName}</span>
                                <ul>
                                    <li><b>Insurance Type:</b> {insuranceType}</li>
                                    <li><b>Insurance Cover:</b> {insuranceCover}</li>
                                    <li><b>Premium Amount:</b> {premiumAmount}</li>
                                </ul>
                                <div>
                                    <button className='card-tag' onClick={() => handlePayPremium(policyid)}>Purchase</button>
                                    <button className='card-tag' onClick={() => handleClaim(policyid)} disabled={disabledClaims[policyid]}>Claim</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PolicyCard;
