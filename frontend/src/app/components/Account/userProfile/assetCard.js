import React, { useState, useEffect } from 'react';
import AllRequestPolicyCard from './allRequestpolicies';
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page';

const HOST = 'http://localhost:3000';

const AssetCard = () => {
    const [assets, setAssets] = useState([]);
    const [selectedAssetID, setSelectedAssetID] = useState(null);

    const handleDelete = async (assetID) => {
        try {
            const response = await fetch(`${HOST}/api/user/asset/delete`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assetid: assetID }),
            });

            if (response.ok) {
                // If the delete request is successful, update the list of assets
                setAssets((prevAssets) =>
                    prevAssets.filter((asset) => asset.assetID !== assetID)
                );
            } else {
                console.error('Failed to delete the asset');
            }
        } catch (error) {
            console.error('Error deleting the asset', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${HOST}/api/user/asset/get`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setAssets(data.reply.assets);
                } else {
                    console.error('Failed to fetch assets data');
                }
            } catch (error) {
                console.error('Error fetching assets data', error);
            }
        }

        fetchData();
    }, []);

    const handleRequestPolicy = (assetID) => {
        setSelectedAssetID(assetID);
    }

    const togglePolicyDisplay = (assetID) => {
        setSelectedAssetID((prevSelectedAssetID) => {
            if (prevSelectedAssetID === assetID) {
                return null; // Toggle off
            } else {
                return assetID; // Toggle on
            }
        });
    }

    return (
        <>
            <div className="main-card--container">
                {assets && assets.length > 0 ? (
                    assets.map((asset) => {
                        const { assetID, assetName, assetType, value, age } = asset;
                        const isPolicyVisible = selectedAssetID === assetID;

                        return (
                            <div className="card-container" key={assetID}>
                                <div className="card">
                                    <div className="card-body">
                                        <h2 className="card-title mt-4">{assetName}</h2>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><b>Asset Type</b></td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{assetType}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Value</b></td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{value}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Age</b></td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{age}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <button
                                            className="card-tag"
                                            onClick={() => togglePolicyDisplay(assetID)}
                                        >
                                            {isPolicyVisible ? 'Hide Policies' : 'Show Policies'}
                                        </button>

                                        <button
                                            className="card-tag"
                                            onClick={() => handleDelete(assetID)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {isPolicyVisible && (
                                    <AllRequestPolicyCard
                                        assetid={assetID}
                                        assetName={assetName}
                                        rendered={true}
                                    />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div
                        className="grid grid-row-2 gap-20"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div className="text-white text-4xl p-5 pt-20" style={{ flex: '1 0 33%' }}>
                            Add some assets to show up here
                        </div>
                        <div style={{ flex: '1' }}>
                            <UserAddAssetAnimation />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AssetCard;