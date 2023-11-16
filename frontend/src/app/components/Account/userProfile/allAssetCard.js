import React, { useState, useEffect } from 'react';
import AllRequestPolicyCard from './allRequestpolicies';
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page';

const HOST = 'http://localhost:3000';

const AllAssetCard = () => {
    const [assets, setAssets] = useState([]);
    const [selectedAssetID, setSelectedAssetID] = useState(null);

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

    return (
        <>
            <div className="main-card--container">
                {assets && assets.length > 0 ? (
                    assets.map((asset) => {
                        const { assetID, assetName, assetType, value, age } = asset;
                        const isPolicyVisible = selectedAssetID === assetID;

                        return (
                            <div className="card-container" style={{marginLeft: '100px', marginRight:'100px', border: '2px solid wheat'}} key={assetID}>
                                <div className="card"  style={{backgroundColor: 'black', color: 'wheat'}}>
                                    <div className="card-body">
                                        <h2 className="card-title" style={{fontSize:'40px'}}>{assetName}</h2>
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
                                            onClick={() => {
                                                // Handle the purchase logic here
                                                console.log('Purchase button clicked for assetID:', assetID);
                                            }}
                                        >
                                            Purchase
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-white text-4xl p-5 pt-20" style={{ flex: '1 0 33%' }}>
                        Add some assets to show up here
                    </div>
                )}
            </div>
        </>
    );
}

export default AllAssetCard;
