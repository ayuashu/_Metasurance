import React, { useEffect, useState } from 'react'
import UserAddAssetAnimation from '../../PolicyAnimation/UserAddAssetAnimation/page'

const HOST = 'http://localhost:3000'

const PolicyCard = () => {
    const [policies, setPolicies] = useState([])

    const handleDelete = async (policyid) => {
        try {
            const response = await fetch(`${HOST}/api/company/deletePolicy`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ policyid }),
            })

            if (response.ok) {
                // If the delete request is successful, update the list of policies
                setPolicies((prevPolicies) =>
                    prevPolicies.filter(
                        (policy) => policy.policyid !== policyid,
                    ),
                )
            } else {
                console.error('Failed to delete the policy')
            }
        } catch (error) {
            console.error('Error deleting the policy', error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${HOST}/api/company/getPolicies`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    },
                )
                if (response.ok) {
                    const data = await response.json()
                    setPolicies(data.reply)
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
            {policies && policies.length > 0 ? (
                <>
                    {policies.map((policy) => {
                        const {
                            policyid,
                            policyname,
                            companyname,
                            premiumamount,
                            insurancecover,
                            insurancetype,
                        } = policy

                        return (
                            <div className="card-container" key={policyid}>
                                <div className="card">
                                    <div className="card-body">
                                        <span className="card-title">{policyname}</span>
                                        <hr style={{ border: '1px solid black', width: '70%', margin: 'auto 0' }} />
                                        <span className="card-author">{companyname}</span>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><b>Insurance Type:</b></td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{insurancetype}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Insurance Cover:</b></td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{insurancecover}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Premium Amount:</b></td>
                                                    <td colSpan="3" style={{ paddingLeft: '20px' }}>{premiumamount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <button className="card-tag" onClick={() => handleDelete(policyid)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : (
                <div className='grid grid-row-2 gap-20' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="text-white text-4xl p-5 pt-20" style={{ flex: '1 0 33%' }}>
                        Add some policies to show up here
                    </div>
                    <div style={{ flex: '1' }}>
                        <UserAddAssetAnimation />
                    </div>
                </div>
            )}
        </div>
    )
}

export default PolicyCard
