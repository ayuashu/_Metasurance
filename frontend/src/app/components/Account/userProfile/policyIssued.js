// 'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page';
import ClaimForm from './claimForm';

const HOST = 'http://localhost:3000';

const PolicyIssued = ({ username }) => {
    const router = useRouter();
    const [policies, setPolicies] = useState([]);
    const cardRef = useRef(null);
    const [insuranceCoverData, setInsuranceCoverData] = useState(new Map());
    const [assetNameData, setAssetNameData] = useState({});
    const [selectedMappingId, setSelectedMappingId] = useState(null);
    const [showClaimForm, setShowClaimForm] = useState(false);
    const [assetid, setAssetId] = useState({});
    const [policyid, setPolicyId] = useState({});
    const [premiumspaid, setPremiumsPaid] = useState({});
    const [companyName, setCompanyName] = useState({});
    const navigate = (location) => {
        router.push(location);
    };

    const handlePayPremium = async (mappingid) => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/paypremium`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mappingid: mappingid }),
                credentials: 'include',
            });
            if (response.ok) {
                setPolicies((prevPolicies) =>
                    prevPolicies.map((policy) => {
                        if (policy.mappingid === mappingid) {
                            return {
                                ...policy,
                                premiumspaid: policy.premiumspaid + 1, // Update premiumspaid
                            };
                        }
                        return policy;
                    })
                );
                alert('Payment was successful');
                console.log('Payment was successful');
            } else {
                console.error('Failed to pay');
            }
        } catch (error) {
            console.error('Error in transaction', error);
        }
    };

    const fetchIssuedPolicies = async () => {
        console.log('Fetching issued policies');
        try {
            const response = await fetch(`${HOST}/api/user/policy/view`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('data is: ', data);
                return data.reply.policies;
            } else {
                console.error('Failed to fetch issued policies');
                return [];
            }
        } catch (error) {
            console.error('Error fetching issued policies', error);
            return [];
        }
    };

    const fetchInsuranceCovers = async () => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/viewall`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetching insurance covers');

                if (
                    data.reply &&
                    data.reply.policyCompanies &&
                    data.reply.policyCompanies.length > 0
                ) {
                    const policyCompanies = data.reply.policyCompanies;

                    const insuranceCoversMap = new Map(); // Create a map for quick lookup

                    for (const company of policyCompanies) {
                        if (company.policies && company.policies.length > 0) {
                            for (const policy of company.policies) {
                                // Use an object as the value to store multiple properties
                                insuranceCoversMap.set(policy.policyid, {
                                    insurancecover: policy.insurancecover,
                                    companyName: company.companyName, // Include companyName
                                });
                            }
                        }
                    }
                    return insuranceCoversMap;
                }
            }
            console.error('Failed to fetch policy data');
            return null;
        } catch (error) {
            console.error('Error fetching policy data', error);
            return null;
        }
    };

    const fetchAssetName = async () => {
        try {
            const response = await fetch(`${HOST}/api/user/asset/get`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetching asset names');
                if (
                    data.reply &&
                    data.reply.assets &&
                    data.reply.assets.length > 0
                ) {
                    const assets = data.reply.assets;
                    const assetNameMap = {}; // Create a map for quick lookup
                    for (const asset of assets) {
                        assetNameMap[asset.assetID] = asset.assetName;
                        console.log(assetNameMap[asset.assetID]);
                    }
                    setAssetNameData(assetNameMap);
                } else {
                    console.error('Failed to fetch asset data');
                }
            }
        } catch (error) {
            console.error('Error fetching asset data', error);
            return 'Not Found';
        }
    };

    const fetchData = async () => {
        try {
            const issuedPolicies = await fetchIssuedPolicies();
            setPolicies(issuedPolicies);

            if (issuedPolicies.length > 0) {
                const insuranceCoversMap = await fetchInsuranceCovers();

                if (insuranceCoversMap) {
                    // Convert the Map to an object for easy access
                    const insuranceCoverDataObject = {};
                    insuranceCoversMap.forEach((value, key) => {
                        insuranceCoverDataObject[key] = value;
                    });
                    setInsuranceCoverData(insuranceCoverDataObject);
                }

                await fetchAssetName(issuedPolicies[0].assetid);
            }
        } catch (error) {
            console.error('Error fetching policy data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClaim = (mappingid, policyid, assetid, premiumspaid) => {
        setSelectedMappingId(mappingid);
        setPolicyId(policyid);
        setAssetId(assetid);
        setPremiumsPaid(premiumspaid);
        setCompanyName(insuranceCoverData[policyid]?.companyName); // Set companyName
        setShowClaimForm((prevShowClaimForm) => !prevShowClaimForm); // Toggle showClaimForm
    };

    const handleUpload = async (
        mappingid,
        policyid,
        assetid,
        premiumspaid,
        claimCause,
        companyName,
        docslinked
    ) => {
        console.log('Submitting claim data');
        try {
            console.log('attempting to submit claim data');
            // Perform the API call with the necessary data
            const response = await fetch(
                `${HOST}/api/user/claim/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        mappingid,
                        policyid,
                        assetid,
                        premiumspaid,
                        claimcause: claimCause,
                        companyName,
                        docslinked: JSON.stringify(docslinked),
                    }),
                    credentials: 'include',
                }
            );

            if (response.ok) {
                alert('Claim submitted successfully');
                console.log('Claim data:', {
                    username,
                    mappingid,
                    policyid,
                    assetid,
                    premiumspaid,
                    claimcause: claimCause,
                    companyName,
                    docslinked,
                });
                setShowClaimForm(false);
                // Optionally, you can refetch data or perform other actions after successful submission
            } else {
                const errorData = await response.json(); // Try to parse error response
                console.error('Failed to submit claim', errorData);
            }
        } catch (error) {
            console.error('Error in claim submission', error);
        }
    };

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

                    const companyName = insuranceCoverData[policyid]?.companyName || 'Not available';

                    return (
                        <div className="card-container" key={mappingid}>
                            <div className="card" ref={cardRef}>
                                <span
                                    className="card-title"
                                    style={{
                                        fontSize: '25px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Policy ID: {policyid}
                                </span>
                                <hr style={{ border: '1px solid black', width: '70%', margin: 'auto 0' }} />
                                <br />
                                <div className="card-body">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <b>Asset Name</b>
                                                </td>
                                                <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                                    {assetNameData[assetid]}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Asset ID</b>
                                                </td>
                                                <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                                    {assetid}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Mapping ID</b>
                                                </td>
                                                <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                                    {mappingid}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Company Name</b>
                                                </td>
                                                <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                                    {companyName}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Claimed</b>
                                                </td>
                                                <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                                    {claimed ? 'Yes' : 'No'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Premiums Paid</b>
                                                </td>
                                                <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                                    {premiumspaid}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Premiums Left</b>
                                                </td>
                                                <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                                    {isNaN(insuranceCoverData[policyid])
                                                        ? 'Not available'
                                                        : insuranceCoverData[policyid] - premiumspaid}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    {!claimed && (
                                        <button
                                            className="card-tag"
                                            onClick={() => handlePayPremium(mappingid)}
                                            disabled={claimed}
                                        >
                                            Pay Premium
                                        </button>
                                    )}
                                    <button
                                        className="card-tag"
                                        onClick={() => handleClaim(mappingid, policyid, assetid, premiumspaid)}
                                        disabled={claimed}
                                    >
                                        {showClaimForm && selectedMappingId === mappingid ? 'Hide Claim' : 'Claim'}
                                    </button>

                                </div>
                            </div>
                            {/* Conditionally render ClaimForm based on the selectedMappingId */}
                            {showClaimForm && selectedMappingId === policy.mappingid && (
                                <ClaimForm
                                    username={username}
                                    mappingid={selectedMappingId}
                                    policyid={policyid}
                                    assetid={assetid}
                                    premiumspaid={premiumspaid}
                                    docslinked={[]}
                                    companyName={companyName} // Pass companyName to ClaimForm
                                    onClose={() => setShowClaimForm(false)}
                                    onUpload={handleUpload}
                                />
                            )}
                        </div>
                    );
                })
            ) : (
                <div
                    className="grid grid-row-2 gap-10"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        className="text-white text-4xl p-5 pt-20"
                        style={{ flex: '1 0 33%' }}
                    >
                        <p style={{ fontSize: '60px', textAlign: 'center' }}>
                            No policies found
                        </p>
                        <br />
                        <p style={{ textAlign: 'center' }}>Wanna issue one!!!</p>
                    </div>
                    <div style={{ flex: '1' }}>
                        <UserAddAssetAnimation />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PolicyIssued;
