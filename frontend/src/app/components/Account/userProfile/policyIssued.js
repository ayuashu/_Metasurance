'use client'
import React, { useEffect, useState, useRef } from 'react'
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page'

const HOST = 'http://localhost:3000'

const PolicyIssued = () => {
    const [policies, setPolicies] = useState([])
    const [disabledClaims, setDisabledClaims] = useState({})
    const cardRef = useRef(null)
    const [insuranceCoverData, setInsuranceCoverData] = useState(new Map())
    const [assetNameData, setAssetNameData] = useState({})

    const handlePayPremium = async (mappingid) => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/paypremium`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mappingid: mappingid }),
                credentials: 'include',
            })
            if (response.ok) {
                setPolicies((prevPolicies) =>
                    prevPolicies.map((policy) => {
                        if (policy.mappingid === mappingid) {
                            return {
                                ...policy,
                                premiumspaid: policy.premiumspaid + 1, // Update premiumspaid
                            }
                        }
                        return policy
                    }),
                )
                alert('Payment was successful')
                console.log('Payment was successful')
            } else {
                console.error('Failed to pay')
            }
        } catch (error) {
            console.error('Error in transaction', error)
        }
    }

    const handleClaim = async (policyID) => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/claim`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mappingid: policyID }),
                credentials: 'include',
            })
            if (response.ok) {
                alert('Claim request was successful')
                console.log('Claim request was successful')
                // Disable the claim button for the policy
                setDisabledClaims((prevDisabledClaims) => ({
                    ...prevDisabledClaims,
                    [policyID]: true,
                }))
                fetchData()
            } else {
                alert('Premiums need to be paid before making a claim')
                console.error('Failed to make a claim')
            }
        } catch (error) {
            console.error('Error in claim transaction', error)
        }
    }

    const fetchIssuedPolicies = async () => {
        console.log('Fetching issued policies')
        try {
            const response = await fetch(`${HOST}/api/user/policy/view`, {
                method: 'GET',
                credentials: 'include',
            })
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                return data.reply.policies
            } else {
                console.error('Failed to fetch issued policies')
                return []
            }
        } catch (error) {
            console.error('Error fetching issued policies', error)
            return []
        }
    }

    const fetchInsuranceCovers = async () => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/viewall`, {
                method: 'GET',
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Fetching insurance covers')
                if (
                    data.reply &&
                    data.reply.policyCompanies &&
                    data.reply.policyCompanies.length > 0
                ) {
                    const policyCompanies = data.reply.policyCompanies

                    const insuranceCoversMap = new Map() // Create a map for quick lookup

                    for (const company of policyCompanies) {
                        if (company.policies && company.policies.length > 0) {
                            for (const policy of company.policies) {
                                insuranceCoversMap.set(
                                    policy.policyid,
                                    policy.insurancecover,
                                )
                                console.log(
                                    insuranceCoversMap.get(policy.policyid),
                                )
                            }
                        }
                    }
                    return insuranceCoversMap
                }
            }
            console.error('Failed to fetch policy data')
            return null // Handle the case where the data is not available
        } catch (error) {
            console.error('Error fetching policy data', error)
            return null
        }
    }

    const fetchAssetName = async () => {
        try {
            const response = await fetch(`${HOST}/api/user/asset/get`, {
                method: 'GET',
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Fetching asset names')
                if (
                    data.reply &&
                    data.reply.assets &&
                    data.reply.assets.length > 0
                ) {
                    const assets = data.reply.assets
                    const assetNameMap = {} // Create a map for quick lookup
                    for (const asset of assets) {
                        assetNameMap[asset.assetID] = asset.assetName
                        console.log(assetNameMap[asset.assetID])
                    }
                    setAssetNameData(assetNameMap)
                } else {
                    console.error('Failed to fetch asset data')
                }
            }
        } catch (error) {
            console.error('Error fetching asset data', error)
            return 'Not Found'
        }
    }
    const fetchData = async () => {
        try {
            const issuedPolicies = await fetchIssuedPolicies()
            setPolicies(issuedPolicies)

            if (issuedPolicies.length > 0) {
                const insuranceCoversMap = await fetchInsuranceCovers()

                if (insuranceCoversMap) {
                    // Convert the Map to an object for easy access
                    const insuranceCoverDataObject = {}
                    insuranceCoversMap.forEach((value, key) => {
                        insuranceCoverDataObject[key] = value
                    })
                    setInsuranceCoverData(insuranceCoverDataObject)
                }

                await fetchAssetName(issuedPolicies[0].assetid)
            }
        } catch (error) {
            console.error('Error fetching policy data', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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
                    } = policy

                    return (
                        <div className="card-container" key={policyid}>
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
                                <hr style={{ border: '1px solid black' }} />
                                <br />
                                <div className="card-body">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <b>Asset Name</b>
                                                </td>
                                                <td
                                                    colSpan="3"
                                                    style={{
                                                        paddingLeft: '20px',
                                                    }}
                                                >
                                                    {assetNameData[assetid]}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Asset ID</b>
                                                </td>
                                                <td
                                                    colSpan="3"
                                                    style={{
                                                        paddingLeft: '20px',
                                                    }}
                                                >
                                                    {assetid}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Mapping ID</b>
                                                </td>
                                                <td
                                                    colSpan="3"
                                                    style={{
                                                        paddingLeft: '20px',
                                                    }}
                                                >
                                                    {mappingid}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Claimed</b>
                                                </td>
                                                <td
                                                    colSpan="3"
                                                    style={{
                                                        paddingLeft: '20px',
                                                    }}
                                                >
                                                    {claimed ? 'Yes' : 'No'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Premiums Paid</b>
                                                </td>
                                                <td
                                                    colSpan="3"
                                                    style={{
                                                        paddingLeft: '20px',
                                                    }}
                                                >
                                                    {premiumspaid}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Premiums Left</b>
                                                </td>
                                                <td
                                                    colSpan="3"
                                                    style={{
                                                        paddingLeft: '20px',
                                                    }}
                                                >
                                                    {isNaN(
                                                        insuranceCoverData[
                                                            policy.policyid
                                                        ],
                                                    )
                                                        ? 'Not available'
                                                        : insuranceCoverData[
                                                              policy.policyid
                                                          ] - premiumspaid}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    {!claimed && (
                                        <button
                                            className="card-tag"
                                            onClick={() =>
                                                handlePayPremium(mappingid)
                                            }
                                            disabled={claimed}
                                        >
                                            Pay Premium
                                        </button>
                                    )}
                                    <button
                                        className="card-tag"
                                        onClick={() => handleClaim(mappingid)}
                                        disabled={claimed}
                                    >
                                        {claimed ? 'Claimed' : 'Claim'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
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
                        <p style={{ textAlign: 'center' }}>
                            Wanna issue one!!!
                        </p>
                    </div>
                    <div style={{ flex: '1' }}>
                        <UserAddAssetAnimation />
                    </div>
                </div>
            )}
        </div>
    )
}

export default PolicyIssued
