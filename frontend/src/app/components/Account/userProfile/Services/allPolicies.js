import React, { useEffect, useState } from 'react'

const HOST = 'http://localhost:3000'

const AllPolicyCard = ({ selectedInsuranceType, selectedCompanyName }) => {
    const [policyCompanies, setPolicyCompanies] = useState([])
    const [filteredPolicyCompanies, setFilteredPolicyCompanies] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
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
                    console.log('Fetched data:', data)
                } else {
                    console.error('Failed to fetch policy data')
                }
            } catch (error) {
                console.error('Error fetching policy data', error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        setFilteredPolicyCompanies(policyCompanies)
        if (selectedCompanyName.length > 0) {
            setFilteredPolicyCompanies((prev) => {
                return prev.filter(
                    (company) => company.companyName === selectedCompanyName,
                )
            })
        }

        if (selectedInsuranceType.length > 0) {
            setFilteredPolicyCompanies((prev) => {
                return prev.map((company) => {
                    const filteredPolicies = company.policies.filter(
                        (policy) =>
                            policy.insurancetype === selectedInsuranceType,
                    )

                    return { ...company, policies: filteredPolicies }
                })
            })
        }
    }, [selectedInsuranceType, selectedCompanyName, policyCompanies])

    return (
        <div className="main-card-container">
            {filteredPolicyCompanies &&
                filteredPolicyCompanies.length > 0 &&
                filteredPolicyCompanies.map((company) => {
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
                                        <div className="card">
                                            <div className="card-body">
                                                <span className="card-title">
                                                    {policyname}
                                                </span>
                                                <span className="card-author">
                                                    {companyName}
                                                </span>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <b>
                                                                    Insurance
                                                                    Type:
                                                                </b>
                                                            </td>
                                                            <td
                                                                colSpan="3"
                                                                style={{
                                                                    paddingLeft:
                                                                        '20px',
                                                                }}
                                                            >
                                                                {insurancetype}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <b>
                                                                    Insurance
                                                                    Cover:
                                                                </b>
                                                            </td>
                                                            <td
                                                                colSpan="3"
                                                                style={{
                                                                    paddingLeft:
                                                                        '20px',
                                                                }}
                                                            >
                                                                {insurancecover}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <b>
                                                                    Premium
                                                                    Amount:
                                                                </b>
                                                            </td>
                                                            <td
                                                                colSpan="3"
                                                                style={{
                                                                    paddingLeft:
                                                                        '20px',
                                                                }}
                                                            >
                                                                {premiumamount}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
        </div>
    )
}

export default AllPolicyCard
