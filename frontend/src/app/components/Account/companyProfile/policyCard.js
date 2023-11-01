import React, { useEffect, useState } from 'react';

const HOST = "http://localhost:3000";

const PolicyCard = ({ username }) => {
    const [policies, setPolicies] = useState([]);

    const handleDelete = async (policyid) => {
        try {
            const response = await fetch(`${HOST}/api/company/deletePolicy`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ policyid }),
            });

            if (response.ok) {
                // If the delete request is successful, update the list of policies
                setPolicies((prevPolicies) => prevPolicies.filter((policy) => policy.policyid !== policyid));
            } else {
                console.error('Failed to delete the policy');
            }
        } catch (error) {
            console.error('Error deleting the policy', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${HOST}/api/company/getPolicies`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setPolicies(data.reply);
                } else {
                    console.error('Failed to fetch policy data');
                }
            } catch (error) {
                console.error('Error fetching policy data', error);
            }
        };

        fetchData(); // Call the fetchData function when the component mounts
    }, []);

    return (
        <div className="main-card-container">
            {policies.map((policy) => {
                const {
                    policyid,
                    policyname,
                    companyname,
                    premiumamount,
                    insurancecover,
                    insurancetype
                } = policy;

                return (
                    <div className="card-container" key={policyid}>
                        <div className="card">
                            <div className="card-body">
                                <span className="card-title">{policyname}</span>
                                <span className="card-author">{companyname}</span>
                                <ul>
                                    <li><b>Insurance Type:</b> {insurancetype}</li>
                                    <li><b>Insurance Cover:</b> {insurancecover}</li>
                                    <li><b>Premium Amount:</b> {premiumamount}</li>
                                </ul>
                            </div>
                            <div>
                                <button className="card-tag" onClick={() => handleDelete(policyid)}>Delete</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PolicyCard;
