import React, { useState } from 'react';

const PolicyCard = ({ policies }) => {
    const [status, setStatus] = useState("active");
    const [showFullDescription, setShowFullDescription] = useState(false);

    const handleDelete = () => {
        setStatus("inactive");
    };

    const handleReadMore = () => {
        setShowFullDescription(!showFullDescription);
    };

    if (!Array.isArray(policies)) {
        return null;
    }

    return (
        <>
            <div className="main-card-container">
                {policies.map((curElem) => {
                    const { id, name, policyName, insuranceType, premiumAmount, insuranceCover, description } = curElem;

                    const descriptionLines = description.split('\n');
                    const truncatedDescription = showFullDescription ? description : descriptionLines.slice(0, 2).join('\n'); 

                    return (
                        <div className="card-container" key={id}>
                            <div className="card">
                                <div className="card-body">
                                    <span className="card-number card-circle subtle">{id}</span>
                                    <h2 className="card-author subtle"> {name} </h2>
                                    <span className="card-title"> {policyName}</span>
                                    <span className="card-description subtle">{truncatedDescription}</span>
                                    {descriptionLines.length > 2 && ( 
                                        <button className="card-tag subtle" onClick={handleReadMore}>
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
        </>
    );
};

export default PolicyCard;
