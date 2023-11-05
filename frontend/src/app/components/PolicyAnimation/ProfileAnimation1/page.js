"use client";
import React from "react";
import Lottie from "react-lottie";
import animationData from '@/app/components/assets/lottie/profile1.json'

function ProfileAnimation1() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    return <Lottie options={defaultOptions} height={300} width={300} />;
}

export default ProfileAnimation1;