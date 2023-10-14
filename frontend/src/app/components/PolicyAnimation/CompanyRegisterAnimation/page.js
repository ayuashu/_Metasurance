"use client";
import React from "react";
import Lottie from "react-lottie";
import animationData from '@/app/components/assets/lottie/companylogin.json'

function CompanyRegisterAnimation() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    return <Lottie options={defaultOptions} height={200} width={200} />;
}

export default CompanyRegisterAnimation;