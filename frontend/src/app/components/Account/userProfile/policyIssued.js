import React, { useEffect, useState, useRef } from 'react';

const HOST = 'http://localhost:3000';

const PolicyIssued = () => {
    const [policies, setPolicies] = useState([]);
    const [disabledClaims, setDisabledClaims] = useState({});
    const cardRef = useRef(null);

    const handlePayPremium = async (policyID) => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/paypremium`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mappingid: policyID }),
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

    const handleClaim = async (policyID) => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/claim`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mappingid: policyID }),
            });
            if (response.ok) {
                console.log('Claim request was successful');
                // Disable the claim button for the policy
                setDisabledClaims((prevDisabledClaims) => ({
                    ...prevDisabledClaims,
                    [policyID]: true,
                }));
            } else {
                console.error('Failed to make a claim');
            }
        } catch (error) {
            console.error('Error in claim transaction', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching data');
            try {
                const response = await fetch(
                    `${HOST}/api/user/policy/view`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setPolicies(data.reply.policies);
                    console.log(data);
                } else {
                    console.error('Failed to fetch policy data');
                }
            } catch (error) {
                console.error('Error fetching policy data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="main-card-container">
            {policies && policies.length > 0 ? (
                policies.map((policy) => {
                    const {
                        assetid,
                        claimed,
                        mappingid,
                        policyid,
                        premiumspaid,
                    } = policy;
                    const policyId = `policy-${policyid}`;

                    return (
                        <div className="card-container" key={policyId}>
                            <div className="card" ref={cardRef}>
                                <div className="card-body">
                                    <span className="card-title">Policy ID: {policyid}</span>
                                    <ul>
                                        <li>
                                            <b>Asset ID:</b> {assetid}
                                        </li>
                                        <li>
                                            <b>Claimed:</b> {claimed ? 'Yes' : 'No'}
                                        </li>
                                        <li>
                                            <b>Mapping ID:</b> {mappingid}
                                        </li>
                                        <li>
                                            <b>Premiums Paid:</b> {premiumspaid}
                                        </li>
                                    </ul>
                                    <div>
                                        <button
                                            className="card-tag"
                                            onClick={() => handlePayPremium(policyid)}
                                        >
                                            Pay Premium
                                        </button>

                                        <button
                                            className="card-tag"
                                            onClick={() => handleClaim(policyid)}
                                            disabled={claimed !== 'Yes' || disabledClaims[policyid]}
                                        >
                                            Claim
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-white text-2xl p-5">
                    No policies found.
                </div>
            )}
        </div >
    );
};

export default PolicyIssued;
