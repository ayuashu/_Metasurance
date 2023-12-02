'use client'
import React, { useState } from 'react';
import axios from 'axios';

const ClaimForm = ({ username, mappingid, policyid, assetid, premiumspaid, onClose, onUpload }) => {
    const [claimCause, setClaimcause] = useState('');
    const [ipfsHash, setIpfsHash] = useState(''); // Variable to store IPFS hash
    const [files, setFiles] = useState('');

    const handleFileUpload = async (file) => {
        try {
            // Create a FormData object to prepare the file for uploading
            const formData = new FormData();
            formData.append('file', file);

            // Make a POST request to Pinata's pinFile endpoint
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': 'c4d8c02e50c482dd5237',
                    'pinata_secret_api_key': '4d3047109743b5c7aecd420134fffddb0c42dd3b08c9da371403916fcf78bbb1',
                },
            });

            // Extract the IPFS hash from the response
            const newIpfsHash = response.data.IpfsHash;
            console.log('IPFS Hash:', newIpfsHash);
            
            const GatewayURL = `https://aquamarine-leading-kangaroo-554.mypinata.cloud/ipfs/${newIpfsHash}`;
            // Store the IPFS hash in the state variable
            setIpfsHash(GatewayURL);
            console.log(GatewayURL);
            return newIpfsHash;
        } catch (error) {
            console.error('Error uploading file to Pinata:', error);
            throw error; // Rethrow the error to be caught in the main handleSubmit function
        }
    };

    const handleUpload = async () => {
        try {
            // Handle multiple file uploads if needed
            const ipfsHashes = await Promise.all(files.map(handleFileUpload));

            // Log the IPFS hashes
            console.log('IPFS Hashes:', ipfsHashes);
        } catch (error) {
            console.error('Error uploading files to IPFS:', error);
            // Handle the error appropriately, e.g., show an error message
        }
    };

    const handleSubmit = async () => {
        try {
            // Continue with the rest of your logic
            const result = await onUpload(mappingid, policyid, assetid, premiumspaid, claimCause, ipfsHash);
            console.log('IPFS Upload Result:', result);

            alert('Claim submitted successfully');
            onClose(); // Close the ClaimForm after uploading
        } catch (error) {
            console.error('Error submitting claim:', error);
            // Handle the error appropriately, e.g., show an error message
        }
    };

    return (
        <div className="main-card--container">
            <div className='card-container' style={{ marginLeft: '100px', marginRight: '100px', border: '2px solid wheat' }}>
                <div className='card' style={{ backgroundColor: 'black', color: 'wheat' }}>
                    <div className='card-body'>
                        <span className='card-title' style={{ textAlign: 'center', fontSize: '40px' }}>Upload the details</span>
                        <table>
                            <tbody>
                                <tr>
                                    <td><b>Mapping id : </b></td>
                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{mappingid}</td>
                                </tr>
                                <tr>
                                    <td><label className="block mt-2 text-sm"><b>Claim Cause</b></label></td>
                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                        <input
                                            type="text"
                                            placeholder="Enter Your Reason to Claim"
                                            value={claimCause}
                                            onChange={(e) => setClaimcause(e.target.value)}
                                            className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                            style={{ backgroundColor: 'black', color: 'white', border: '1px solid white' }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><label className="block text-sm"><b>Upload Documents</b></label></td>
                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>
                                        <div className="flex items-center">
                                            <label htmlFor="file-upload" className="py-2 px-5 me-10 mt-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                                Select Files
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                onChange={async (e) => {
                                                    const selectedFiles = e.target.files;
                                                    setFiles(Array.from(selectedFiles));
                                                }}
                                                multiple
                                                className="hidden"
                                            />
                                            <button onClick={handleUpload} className="py-2 px-5 me-10 mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                                Upload
                                            </button>
                                        </div>

                                        {files && (
                                            <ul className="mt-2">
                                                {files.map((file, index) => (
                                                    <li key={index} className="text-sm">{file.name}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <button onClick={handleSubmit} className="block px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
                                Submit
                            </button>
                            <button onClick={onClose} className="block px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimForm;
