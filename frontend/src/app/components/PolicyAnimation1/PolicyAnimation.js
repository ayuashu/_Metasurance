import React from "react";
import Lottie from "react-lottie";
import animationData from '@/app/components/assets/lottie/lottie1.json'

function PolicyAnimation1() {
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

export default PolicyAnimation1;
