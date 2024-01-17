// 'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page';
import ClaimForm from './claimForm';
import { motion } from 'framer-motion';
import { ImCross } from 'react-icons/im';

const HOST = 'http://localhost:3000';

const Backdrop = ({ onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full bg-black z-50"
            onClick={onClick}
        />
    );
};

const PolicyIssued = ({ username, balance }) => {
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
    const [claimsperyear, setClaimsPerYear] = useState(new Map());
    const [premiumAmount, setPremiumAmount] = useState({});
    const [showModal, setShowModal] = useState(false);

    const handlePayPremium = async (mappingid, minBalance) => {
        if (balance < minBalance) {
            alert(`Insufficient balance, please purchase at least ${minBalance} tokens`);
            return;
        }
        try {
            const response = await fetch(`${HOST}/api/user/policy/paypremium`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mappingid: mappingid, purchaseAmount: String(minBalance) }),
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
                window.location.reload();
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

    const fetchClaimsPerYear = async () => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/viewall`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetching claims per year');
                console.log(data);

                if (
                    data.reply &&
                    data.reply.policyCompanies &&
                    data.reply.policyCompanies.length > 0
                ) {
                    const policyCompanies = data.reply.policyCompanies;

                    const claimsPerYrMap = new Map(); // Create a map for quick lookup

                    for (const company of policyCompanies) {
                        if (company.policies && company.policies.length > 0) {
                            for (const policy of company.policies) {
                                // Use an object as the value to store multiple properties
                                claimsPerYrMap.set(policy.policyid, {
                                    claimsperyear: policy.claimsperyear,
                                    companyName: company.companyName,
                                    premiumAmount: policy.premiumamount,
                                    insuranceCover: policy.insurancecover,
                                });
                            }
                        }
                    }
                    return claimsPerYrMap;
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
                const claimsPerYrMap = await fetchClaimsPerYear();

                if (insuranceCoversMap) {
                    // Convert the Map to an object for easy access
                    const insuranceCoverDataObject = {};
                    insuranceCoversMap.forEach((value, key) => {
                        insuranceCoverDataObject[key] = value;
                    });
                    setInsuranceCoverData(insuranceCoverDataObject);
                }

                if (claimsPerYrMap) {
                    // Convert the Map to an object for easy access
                    const claimsPerYrDataObject = {};
                    claimsPerYrMap.forEach((value, key) => {
                        claimsPerYrDataObject[key] = value;
                    });
                    setClaimsPerYear(claimsPerYrDataObject);
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
        setShowModal(true);
        setSelectedMappingId(mappingid);
        setPolicyId(policyid);
        setAssetId(assetid);
        setPremiumsPaid(premiumspaid);
        setCompanyName(insuranceCoverData[policyid]?.companyName); // Set companyName
        setShowClaimForm((prevShowClaimForm) => !prevShowClaimForm); // Toggle showClaimForm
    };

    const handleClose = () => {
        setShowModal(false);
    }

    const handleUpload = async (mappingid, policyid, assetid, premiumspaid, claimCause, companyName, docslinked) => {
        console.log('Submitting claim data');
        try {
            alert('Attempting to submit claim data');
            console.log({ username, mappingid, policyid, assetid, premiumspaid, claimcause: claimCause, companyName, docslinked: JSON.stringify(docslinked), claimsperyear: parseInt(claimsperyear[policyid]?.claimsperyear) })
            const response = await fetch(`${HOST}/api/user/claim/register`, {
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
                    claimsperyear: parseInt(claimsperyear[policyid]?.claimsperyear)
                }),
                credentials: 'include',
            });

            console.log('Response Status:', response.status);
            const responseData = await response.json();
            console.log('Response Data:', responseData);
            if (responseData.error) {
                alert(responseData.error);
                return;
            }

            if (response.ok) {
                console.log('Claim data:', {
                    username,
                    mappingid,
                    policyid,
                    assetid,
                    premiumspaid,
                    claimcause: claimCause,
                    companyName,
                    docslinked,
                    claimsperyear
                });

                alert('Claim submitted successfully');
                setShowClaimForm(false);
                console.log('Claim submission process complete');
                window.location.reload();
            } else {
                console.error('Failed to submit claim', responseData);
            }
        } catch (error) {
            console.error('Error in claim submission', error);
        }
    };

    return (
        <>
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
                        const minBalance = Math.ceil(
                            ((claimsperyear[policyid]?.premiumAmount || 0) /
                                (insuranceCoverData[policyid]?.insurancecover *
                                    (claimsperyear[policyid]?.claimsperyear || 1)))
                        );

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
                                                        <b>Claims per year</b>
                                                    </td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                                        {isNaN(claimsperyear[policyid]?.claimsperyear)
                                                            ? 'Not available'
                                                            : claimsperyear[policyid].claimsperyear}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <b>Premiums Left</b>
                                                    </td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                                        {isNaN(insuranceCoverData[policyid]?.insurancecover)
                                                            ? 'Not available'
                                                            : insuranceCoverData[policyid].insurancecover - premiumspaid}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        {!claimed && (
                                            <button
                                                className="card-tag"
                                                onClick={() => handlePayPremium(mappingid, minBalance)}
                                                disabled={claimed || insuranceCoverData[policyid]?.insurancecover - premiumspaid === 0}
                                                style={insuranceCoverData[policyid]?.insurancecover - premiumspaid === 0 ? { cursor: 'not-allowed', pointerEvents: 'none', opacity: 0.5 } : {}}
                                            >
                                                Pay Premium
                                            </button>
                                        )}
                                        <button
                                            className="card-tag"
                                            onClick={() => handleClaim(mappingid, policyid, assetid, premiumspaid)}
                                            disabled={claimed}
                                        >
                                            {'Claim'}
                                        </button>
                                    </div>

                                </div>
                                {showModal && (
                                    <>
                                        <Backdrop onClick={handleClose} />
                                        <div
                                            className="fixed top-0 left-0 w-full h-full bg-black opacity-60 z-100"
                                            onClick={handleClose}
                                        ></div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 50 }}
                                            className="fixed top-1/4 bg-slate-900 flex flex-col z-[101] rounded-xl overflow-hidden"
                                            style={{ maxHeight: '60vh', width: '50vw' }}
                                        >
                                            <div className="w-full h-8 flex items-center justify-between cursor-pointer my-5">
                                                <p>{         }</p>
                                                <p className='text-white font-bold mt-8 ml-24' style={{fontSize: '40px'}}>Claim Form</p>
                                                <p className="text-black text-lg font-semibold"></p>

                                                <motion.div
                                                    whileTap={{ scale: 0.75 }}
                                                    className="flex items-center gap-2 py-1 px-2 my-5 mr-4 bg-gray-200 rounded-md hover:shadow-xl hover:bg-grey-500 cursor-pointer text-textColor text-base"
                                                    onClick={handleClose}
                                                >
                                                    <ImCross />
                                                </motion.div>
                                            </div>
                                            <div className="w-full flex flex-col overflow-y-auto pb-5">
                                                {selectedMappingId === policy.mappingid && (
                                                    <ClaimForm
                                                        username={username}
                                                        mappingid={selectedMappingId}
                                                        policyid={policyid}
                                                        assetid={assetid}
                                                        premiumspaid={premiumspaid}
                                                        docslinked={[]}
                                                        companyName={companyName}
                                                        onClose={() => setShowClaimForm(false)}
                                                        onUpload={handleUpload}
                                                    />
                                                )}
                                            </div>
                                        </motion.div>
                                    </>
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


        </>
    );
};

export default PolicyIssued;
