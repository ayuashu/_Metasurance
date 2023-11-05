"use client";
import React from "react";
import Lottie from "react-lottie";
import animationData from '@/app/components/assets/lottie/profile.json'

function ProfileAnimation() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    return <Lottie options={defaultOptions} height={250} width={250} />;
}

export default ProfileAnimation;