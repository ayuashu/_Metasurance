import React, { useState, useEffect } from 'react'
import AllRequestPolicyCard from './allRequestpolicies'

const HOST = 'http://localhost:3000'

const AssetCard = ({ username }) => {
    const [assets, setAssets] = useState([])
    const [showAllPolicies, setShowAllPolicies] = useState(false)
    const [selectedAssetID, setSelectedAssetID] = useState(null)

    const handleDelete = async (assetID) => {
        try {
            const response = await fetch(`${HOST}/api/user/asset/delete`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assetid: assetID }), // Send assetID in the request body
            })

            if (response.ok) {
                // If the delete request is successful, update the list of assets
                setAssets((prevAssets) =>
                    prevAssets.filter((asset) => asset.assetID !== assetID),
                )
            } else {
                console.error('Failed to delete the asset')
            }
        } catch (error) {
            console.error('Error deleting the asset', error)
        }
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
                    setAssets(data.reply.assets)
                    console.log(data)
                } else {
                    console.error('Failed to fetch assets data')
                }
            } catch (error) {
                console.error('Error fetching assets data', error)
            }
        }

        fetchData()
    }, [])

    const handleRequestPolicy = (assetID) => {
        setSelectedAssetID(assetID)
        setShowAllPolicies((prev) => !prev)
    }

    return (
        <>
            <div className="main-card--container">
                {assets && assets.length > 0 ? (
                    assets.map((asset) => {
                        const { assetID, assetName, assetType, value, age } =
                            asset

                        return (
                            <div className="card-container" key={assetID}>
                                <div className="card">
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            {assetName}
                                        </h2>
                                        <ul>
                                            <li>Asset Type: {assetType}</li>
                                            <li>Value: {value}</li>
                                            <li>Age: {age}</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <button
                                            className="card-tag"
                                            onClick={() =>
                                                handleRequestPolicy(assetID)
                                            }
                                        >
                                            Get Policies
                                        </button>
                                        <button
                                            className="card-tag"
                                            onClick={() =>
                                                handleDelete(assetID)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-white text-2xl p-5">
                        Add some assets to show up here
                    </div>
                )}
            </div>

            {/* Render the AllPolicies component conditionally */}
            {showAllPolicies && (
                <AllRequestPolicyCard
                    assetID={selectedAssetID}
                    rendered={true}
                />
            )}
        </>
    )
}

export default AssetCard
