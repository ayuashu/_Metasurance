'use client'
import React, { useState } from 'react'
import axios from 'axios'

const JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1NmEwZGUxMC1mNjg5LTQ2MDctYmIwMy1lMDlkMjEwMzc2ZWIiLCJlbWFpbCI6Im9nY29kaW5nZ29kQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2MTBlOWE1OWIyNTFhNTk0NjA5ZiIsInNjb3BlZEtleVNlY3JldCI6ImViOGRlYmVhZTY5MTliMjhlZDRkY2RlZmUyMzdmNjAxZTk1MDk4MTc5MzBkYjdlYTBkODc1NzEwNTU3MjdkZTgiLCJpYXQiOjE3MDIyMTMyMzN9.KS6TB4IUd9cWzzzuHdQZg7Ai-JSzAZpQQ9os3lIsf48'

const ClaimForm = ({
    username,
    mappingid,
    policyid,
    assetid,
    premiumspaid,
    companyName,
    ipfsHashes,
    onClose,
    onUpload,
}) => {
    const [claimCause, setClaimcause] = useState('')
    const [ipfsHash, setIpfsHash] = useState('') // Variable to store IPFS hash
    const [files, setFiles] = useState('')

    const handleFileUpload = async (file) => {
        try {
            // Create a FormData object to prepare the file for uploading
            const formData = new FormData()
            formData.append('file', file)

            // Make a POST request to Pinata's pinFile endpoint
            const response = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                formData,
                {
                    maxBodyLength: 'Infinity',
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    },
                },
            )

            // Extract the IPFS hash from the response
            const newIpfsHash = response.data.IpfsHash
            const GatewayURL = `https://maroon-worrying-swan-904.mypinata.cloud/ipfs/${newIpfsHash}`
            // Store the IPFS hash in the state variable
            setIpfsHash(GatewayURL)
            return GatewayURL
        } catch (error) {
            console.error('Error uploading file to Pinata:', error)
            throw error // Rethrow the error to be caught in the main handleSubmit function
        }
    }

    const handleUpload = async () => {
        try {
            // Handle multiple file uploads if needed
            const ipfsHashes = await Promise.all(files.map(handleFileUpload))
            // Log the IPFS hashes
            console.log('IPFS Hashes:', ipfsHashes)
            alert('Files uploaded successfully')
            return ipfsHashes
        } catch (error) {
            console.error('Error uploading files to IPFS:', error)
            // Handle the error appropriately, e.g., show an error message
        }
    }

    const handleSubmit = async () => {
        try {
            // Continue with the rest of your logic
            const ipfsHashes = await handleUpload()
            const result = await onUpload(
                mappingid,
                policyid,
                assetid,
                premiumspaid,
                claimCause,
                companyName,
                ipfsHashes,
            )
        } catch (error) {
            console.error('Error submitting claim:', error)
            // Handle the error appropriately, e.g., show an error message
        }
    }

    return (
        <div className="main-card--container">
            <div
                className="card-container"
                style={{
                    marginLeft: '100px',
                    marginRight: '100px',
                    border: '2px solid wheat',
                }}
            >
                <div
                    className="card"
                    style={{ backgroundColor: 'black', color: 'wheat' }}
                >
                    <div className="card-body">
                        <span
                            className="card-title"
                            style={{ textAlign: 'center', fontSize: '40px' }}
                        >
                            Upload the details
                        </span>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Mapping id : </b>
                                    </td>
                                    <td
                                        colSpan="3"
                                        style={{ paddingLeft: '20px' }}
                                    >
                                        {mappingid}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className="block mt-2 text-sm">
                                            <b>Claim Cause</b>
                                        </label>
                                    </td>
                                    <td
                                        colSpan="3"
                                        style={{ paddingLeft: '20px' }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Enter Your Reason to Claim"
                                            value={claimCause}
                                            onChange={(e) =>
                                                setClaimcause(e.target.value)
                                            }
                                            className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                            style={{
                                                backgroundColor: 'black',
                                                color: 'white',
                                                border: '1px solid white',
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className="block text-sm">
                                            <b>Upload Documents</b>
                                        </label>
                                    </td>
                                    <td
                                        colSpan="3"
                                        style={{ paddingLeft: '20px' }}
                                    >
                                        <div className="flex items-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="py-2 px-5 me-10 mt-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                            >
                                                Select Files
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                onChange={async (e) => {
                                                    const selectedFiles =
                                                        e.target.files
                                                    setFiles(
                                                        Array.from(
                                                            selectedFiles,
                                                        ),
                                                    )
                                                }}
                                                multiple
                                                className="hidden"
                                            />
                                        </div>

                                        {files && (
                                            <ul className="mt-2">
                                                {files.map((file, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-sm"
                                                    >
                                                        {file.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <button
                                onClick={handleSubmit}
                                className="block px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                            >
                                Submit
                            </button>
                            <button
                                onClick={onClose}
                                className="block px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClaimForm
