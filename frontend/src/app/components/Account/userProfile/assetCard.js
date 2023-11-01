import React, { useState, useEffect } from 'react'

const HOST = 'http://localhost:3000'

const AssetCard = ({ username }) => {
    const [assets, setAssets] = useState([])
    const [policies, setPolicies] = useState({})
    const [claimStatus, setClaimStatus] = useState({})

    const handlePolicyIssued = (assetId) => {
        setPolicies({ ...policies, [assetId]: 'Policy issued for this asset.' })
        setClaimStatus({ ...claimStatus, [assetId]: 'active' })
    }

    const handleClaim = (assetId) => {
        setClaimStatus({ ...claimStatus, [assetId]: 'claimed' })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${HOST}/api/user/asset/get`, {
                    method: 'GET',
                    credentials: 'include',
                })
                if (response.ok) {
                    const data = await response.json()
                    setAssets(data)
                } else {
                    console.error('Failed to fetch assets data')
                }
            } catch (error) {
                console.error('Error fetching assets data', error)
            }
            // setAssets([
            //     {
            //         id: 1,
            //         assetName: 'Car',
            //         assetType: 'Automobile',
            //         value: '$100,000',
            //         age: '5 years'
            //     },
            //     {
            //         id: 2,
            //         assetName: 'House',
            //         assetType: 'Real Estate',
            //         value: '$500,000',
            //         age: '10 years'
            //     },
            //     {
            //         id: 3,
            //         assetName: 'Boat',
            //         assetType: 'Watercraft',
            //         value: '$50,000',
            //         age: '2 years'
            //     }
            // ])
        }

        fetchData() // Call the fetchData function when the component mounts
    }, [])

    return (
        <>
            <div className="main-card--container">
                {assets.length > 0 ? (
                    assets.map((curElem) => {
                        const { id, name, assetName, assetType, value, age } =
                            curElem

                        const assetId = `asset-${id}`
                        const isPolicyIssued = policies[assetId] !== undefined
                        const isClaimed = claimStatus[assetId] === 'claimed'

                        return (
                            <div className="card-container" key={id}>
                                <div className="card">
                                    <div className="card-body">
                                        <span className="card-number card-circle subtle">
                                            {id}
                                        </span>
                                        <span className="card-author subtle">
                                            {' '}
                                            {name}
                                        </span>
                                        <h2 className="card-title">
                                            {' '}
                                            {assetName}{' '}
                                        </h2>
                                        <ul>
                                            <li>Asset Type: {assetType}</li>
                                            <li>Value: {value}</li>
                                            <li>Age: {age}</li>
                                        </ul>
                                    </div>
                                    <div>
                                        {isPolicyIssued ? (
                                            <button
                                                className={`card-tag ${
                                                    isClaimed ? 'subtle' : ''
                                                }`}
                                            >
                                                {isClaimed
                                                    ? 'Claimed'
                                                    : 'Policy Issued'}
                                            </button>
                                        ) : (
                                            <button
                                                className="card-tag"
                                                onClick={() =>
                                                    handlePolicyIssued(assetId)
                                                }
                                            >
                                                Policy Issued
                                            </button>
                                        )}
                                        {isPolicyIssued && !isClaimed && (
                                            <button
                                                className="card-tag"
                                                onClick={() =>
                                                    handleClaim(assetId)
                                                }
                                            >
                                                Claim
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-white text-2xl p-6">
                        Add some assets to show here
                    </div>
                )}
            </div>
        </>
    )
}

export default AssetCard
