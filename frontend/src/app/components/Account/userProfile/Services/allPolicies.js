import React, { useEffect, useState, useRef } from 'react'

const HOST = 'http://localhost:3000'

const AllPolicyCard = ({ rendered }) => {
    const [policyCompanies, setPolicyCompanies] = useState([])
    const cardRef = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (rendered) {
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
                        console.log('Fetched data:', data) // Log the data
                    } else {
                        console.error('Failed to fetch policy data')
                    }
                }
            } catch (error) {
                console.error('Error fetching policy data', error)
            }
        }

        fetchData() // Call the fetchData function when the component mounts
    }, [rendered])

    return (
        <div className="main-card-container">
            {policyCompanies && policyCompanies.length > 0 ? (
                policyCompanies.map((company) => {
                    const { companyName, policies } = company

                    return (
                        <div key={companyName}>
                            {policies.map((policy) => {
                                const {
                                    policyid,
                                    policyname,
                                    insurancetype,
                                    premiumamount,
                                    insurancecover,
                                } = policy

                                const policyId = `policy-${policyid}`

                                return (
                                    <div
                                        className="card-container"
                                        key={policyId}
                                    >
                                        <div className="card" ref={cardRef}>
                                            <div className="card-body">
                                                <span className="card-title">
                                                    {policyname}
                                                </span>
                                                <span className="card-author">
                                                    {companyName}
                                                </span>
                                                <ul>
                                                    <li>
                                                        <b>Insurance Type:</b>{' '}
                                                        {insurancetype}
                                                    </li>
                                                    <li>
                                                        <b>Insurance Cover:</b>{' '}
                                                        {insurancecover}
                                                    </li>
                                                    <li>
                                                        <b>Premium Amount:</b>{' '}
                                                        {premiumamount}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })
            ) : (
                <div className="text-white text-2xl p-5">
                    The policies that companies adds will show up here
                </div>
            )}
        </div>
    )
}

export default AllPolicyCard
