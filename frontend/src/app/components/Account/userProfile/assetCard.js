import React, { useState, useEffect } from 'react';
import AllRequestPolicyCard from './allRequestpolicies';
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page';
import { motion } from 'framer-motion';
import { ImCross } from 'react-icons/im';
import Backdrop from '../../assets/Backdrop/page';

const HOST = 'http://localhost:3000';



const AssetCard = ({ balance }) => {
    const [assets, setAssets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [assetType, setAssetType] = useState(null);
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

            let text = await response.json();

            if (text.error) {
                alert(text.error)
            }

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

    const handleDisplay = (assetID, assetType) => {
        setSelectedAssetID(assetID);
        setAssetType(assetType);
        setShowModal(true);
    }

    const handleClose = () => {
        setShowModal(false);
    }

    return (
        <>
            <div className="main-card--container">
                {assets && assets.length > 0 ? (
                    assets.map((asset) => {
                        const { assetID, assetName, assetType, value, age } = asset;
                        const selectedAssetID = assetID;

                        return (
                            <div className="card-container" key={assetID}>
                                <div className="card">
                                    <div className="card-body">
                                        <span className="card-title mt-4">{assetName}</span>
                                        <hr style={{ border: '1px solid black', width: '70%', margin: 'auto 0' }} />
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><b>Asset Type</b></td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{assetType}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Value</b></td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{value} tokens</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Age</b></td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{age} Years</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <button
                                            className="card-tag"
                                            onClick={() => handleDisplay(assetID, assetType)}
                                        >
                                            Get a Policy
                                        </button>

                                        <button
                                            className="card-tag"
                                            onClick={() => handleDelete(assetID)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
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
                        className="fixed top-1/4 bg-slate-900 drop-shadow-md flex flex-col z-[101] rounded-xl overflow-hidden"
                        style={{ maxHeight: '50vh', width: '50vw' }}
                    >
                        <div className="w-full flex items-center justify-end p-4 cursor-pointer">
                            <p></p>
                            <p className="text-black text-lg font-semibold"></p>

                            <motion.p
                                whileTap={{ scale: 0.75 }}
                                className="flex items-center gap-2 p-1 px-2 my-2 bg-gray-200 rounded-md hover:shadow-xl hover:bg-grey-500 cursor-pointer text-textColor text-base"
                                onClick={handleClose}
                            >
                                <ImCross />
                            </motion.p>
                        </div>
                        <div className="w-full flex flex-col overflow-y-auto py-5 bar">
                            {selectedAssetID && (
                                <AllRequestPolicyCard
                                    assetid={selectedAssetID}
                                    assetType={assetType}
                                    balance={balance}
                                />
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </>
    );
}

export default AssetCard;