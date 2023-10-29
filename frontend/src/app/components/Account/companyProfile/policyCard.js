import React, { useEffect, useState, useRef } from 'react';

const PolicyCard = ({ username }) => {
    const [policies, setPolicies] = useState([])
    const [status, setStatus] = useState("active");
    const [showFullDescriptions, setShowFullDescriptions] = useState({});
    const cardRef = useRef(null);
    
    const handleDelete = () => {
        setStatus("inactive");
    };

    const handleReadMore = (id) => {
        // Toggle the state for the clicked policy
        setShowFullDescriptions((prevShowFullDescriptions) => ({
            ...prevShowFullDescriptions,
            [id]: !prevShowFullDescriptions[id],
        }));
    };


    // if (!Array.isArray(username)) {
    //     return null;
    // }

    useEffect(() => {
        // Simulate fetching assets data from an API or other data source
        // Replace this with your actual data fetching logic
        const fetchData = async () => {
            // try {
            //     // Simulate fetching assets data
            //     const response = await fetch('/api/assets'); // Replace with your API endpoint
            //     if (response.ok) {
            //         const data = await response.json();
            //         setPolicies(data);
            //     } else {
            //         console.error('Failed to fetch assets data');
            //     }
            // } catch (error) {
            //     console.error('Error fetching assets data', error);
            // }
            setPolicies([
                {
                    id: 1,
                    name: 'John Doe',
                    policyName: 'Car',
                    insuranceType: 'Automobile',
                    premiumAmount: '$100,000',
                    insuranceCover: '5 years',
                    description: 'dhwdiwhdiwed diwqbndiwnd uhdiwqdwq dubhdwqbdwq iudwqibdwq bdiwqsdfwefwen wenjnwenfewf nofewd fewodf weofnd nodnoe wnfo wefdi nwedw wendoewnfoewnfoewnf wfnoewnfoewnfewf ndfownfoewncoewnfew fewonfoewnfewoincwed cnodwncoewc nd wqdbbdwq uqdhqwkbdiqwudh iuhediqwdiqwd b ibedqwibdqw ubhdiwqbd udiqwbdbwqd qiuwdqwd '
                },
                {
                    id: 2,
                    name: 'Alice Smith',
                    policyName: 'Home',
                    insuranceType: 'Property',
                    premiumAmount: '$200,000',
                    insuranceCover: '10 years',
                    description: 'This is a description for the Home insurance policy.'
                },
                {
                    id: 3,
                    name: 'Bob Johnson',
                    policyName: 'Health',
                    insuranceType: 'Medical',
                    premiumAmount: '$50,000',
                    insuranceCover: '2 years',
                    description: 'Another policy description for Health insurance.'
                }
            ])
        };

        fetchData(); // Call the fetchData function when the component mounts
    }, []);

    useEffect(() => {
        // Calculate the number of lines for description based on card height
        if (cardRef.current) {
            const cardHeight = cardRef.current.offsetHeight;
            const lineHeight = 18; // Adjust this value according to your CSS
            const lines = Math.floor(cardHeight / lineHeight);
            setLineLimit(lines);
        }
    }, []);

    const setLineLimit = (lines) => {
        setPolicies((prevPolicies) =>
            prevPolicies.map((policy) => ({
                ...policy,
                lineLimit: lines,
            }))
        );
    };

    return (
        <div className="main-card-container">
            {policies.map((curElem) => {
                const { id, policyName, insuranceType, premiumAmount, insuranceCover, description, lineLimit } = curElem;
                const showFullDescription = showFullDescriptions[id];
                const descriptionLines = description.split('\n');
                const descriptionLineCount = descriptionLines.length;
                const shouldShowReadMore = descriptionLineCount > lineLimit;

                return (
                    <div className="card-container" key={id}>
                        <div className="card" ref={cardRef}>
                            <div className="card-body">
                                <span className="card-title"> {policyName}</span>
                                <p className="card-description subtle">
                                    {showFullDescription
                                        ? description
                                        : descriptionLines.slice(0, lineLimit).join('\n') +
                                          (shouldShowReadMore ? '...' : '')}
                                </p>
                                {shouldShowReadMore && (
                                    <button className="card-tag subtle" onClick={() => handleReadMore(id)}>
                                        {showFullDescription ? "Read Less" : "Read More"}
                                    </button>
                                )}
                                <ul>
                                    <li><b>Insurance Type</b> : {insuranceType}</li>
                                    <li><b>Insurance Cover</b> : {insuranceCover}</li>
                                    <li><b>Premium Amount</b> : {premiumAmount}</li>
                                </ul>
                            </div>
                            <div>
                                {status === "active" && (
                                    <button className="card-tag subtle" onClick={handleDelete}>Delete</button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PolicyCard;
