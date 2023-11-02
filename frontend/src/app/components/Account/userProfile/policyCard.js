import React, { useEffect, useState, useRef } from 'react'

const HOST = 'http://localhost:3000'

const PolicyCard = () => {
    const [policies, setPolicies] = useState([])
    const [disabledClaims, setDisabledClaims] = useState({})
    const cardRef = useRef(null)
    const handlePayPremium = async (policyid) => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/paypremium`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mappingid: policyid }),
            })
            if (response.ok) {
                console.log('Payment was successful')
            } else {
                console.error('Failed to pay')
            }
        } catch (error) {
            console.error('Error in transaction', error)
        }
    }

    const handleClaim = async (policyid) => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/claim`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mappingid: policyid }),
            })
            if (response.ok) {
                console.log('Claim request was successful')
                // Disable the claim button for the policy
                setDisabledClaims((prevDisabledClaims) => ({
                    ...prevDisabledClaims,
                    [policyid]: true,
                }))
            } else {
                console.error('Failed to make a claim')
            }
        } catch (error) {
            console.error('Error in claim transaction', error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
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
                    setPolicies(data.reply.policyCompanies)
                    console.log(data)
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
                policies.map((policyCompany) => {
                    const { companyName, policies } = policyCompany
                    console.log({ p: policyCompany.policies })
                    return policies && policies.length > 0 ? (
                        policies.map((policy) => {
                            const {
                                companyname,
                                insurancecover,
                                policyid,
                                insurancetype,
                                policyname,
                                premiumamount,
                            } = policy
                            const policyId = `policy-${policyid}`

                            return (
                                <div className="card-container" key={policyid}>
                                    <div className="card" ref={cardRef}>
                                        <div className="card-body">
                                            <span className="card-title">
                                                {policyname}
                                            </span>
                                            <span className="card-author">
                                                {companyname}
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
                                            <div>
                                                <button
                                                    className="card-tag"
                                                    onClick={() =>
                                                        handlePayPremium(
                                                            policyid,
                                                        )
                                                    }
                                                >
                                                    Purchase
                                                </button>
                                                <button
                                                    className="card-tag"
                                                    onClick={() =>
                                                        handleClaim(policyid)
                                                    }
                                                    disabled={
                                                        disabledClaims[policyid]
                                                    }
                                                >
                                                    Claim
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-white text-2xl p-5">
                            Policies that you register for will show here
                        </div>
                    )
                })
            ) : (
                <div className="text-white text-2xl p-5">
                    Policies that you register for will show here
                </div>
            )}
        </div>
    )
}

export default PolicyCard
