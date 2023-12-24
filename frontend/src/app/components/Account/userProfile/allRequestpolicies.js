// 'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const HOST = 'http://localhost:3000'

const AllRequestPolicyCard = ({ assetid, assetType }) => {
    const [policyCompanies, setPolicyCompanies] = useState([])
    const cardRef = useRef(null)
    const router = useRouter()
    const navigate = (location) => {
        router.push(location)
    }

    const handleRequestPolicy = async (policyid, assetid) => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/request`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    policyid: policyid, // Include policyid
                    assetid: assetid,   // Include assetid
                }),
            });
            if (response.ok) {
                alert('Policy purchase was successful');
                console.log('Policy purchase was successful');
                window.location.reload();
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
                // Fetch data only if the component has been rendered
                const response = await fetch(
                    `${HOST}/api/user/policy/viewall`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    },
                )
                if (response.ok) {
                    const data = await response.json()
                    setPolicyCompanies(data.reply.policyCompanies)
                    console.log(data) // Log the data
                } else {
                    console.error('Failed to fetch policy data')
                }
            } catch (error) {
                console.error('Error fetching policy data', error)
            }
        }
        fetchData() // Call the fetchData function when the component mounts
    }, [])

    return (
        <div className="main-card-container">
            {policyCompanies && policyCompanies.length > 0 ? (
                policyCompanies.map((company) => {
                    const { companyName, policies } = company

                    return (
                        <div key={companyName}>
                            {policies && policies.length > 0 ? (
                                policies
                                    .filter((policy) => policy.insurancetype === assetType) // Filter policies based on assetType
                                    .map((policy) => {
                                        const {
                                            policyid,
                                            policyname,
                                            insurancetype,
                                            premiumamount,
                                            insurancecover,
                                            claimsperyear
                                        } = policy

                                        const policyId = `policy-${policyid}`

                                        return (
                                            <div
                                                className="card-container"
                                                style={{
                                                    marginLeft: '100px',
                                                    marginRight: '100px',
                                                    border: '2px solid wheat',
                                                }}
                                                key={policyId}
                                            >
                                                <div
                                                    className="card" style={{ backgroundColor: 'black', color: 'wheat' }} ref={cardRef}>
                                                    <div className="card-body">
                                                        <span className="card-title" style={{ fontSize: '40px' }}>
                                                            {policyname}
                                                        </span>
                                                        <hr style={{ border: '1px solid wheat', width: '70%', margin: 'auto 0' }} />
                                                        <span className="card-author">
                                                            {companyName}
                                                        </span>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td><b>Insurance Type</b></td>
                                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{insurancetype}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Insurance Cover</b></td>
                                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{insurancecover}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Premium Amount</b></td>
                                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{premiumamount}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><b>Claims per year</b></td>
                                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{claimsperyear}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="card-tag"
                                                            onClick={() => handleRequestPolicy(policyid, assetid)}>
                                                            Purchase
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                            ) : (
                                <div className="text-white text-2xl p-5">
                                    No policies available for {assetType}
                                </div>
                            )}
                        </div>
                    )
                })
            ) : (
                <div className="text-white text-2xl p-5">
                    No policies available
                </div>
            )}
        </div>
    )
}

export default AllRequestPolicyCard
