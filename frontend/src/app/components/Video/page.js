"use client"
import Image from 'next/image';
import React, { useRef } from 'react';

const Video = () => {
  const videoSrc = 'https://i.pinimg.com/originals/0c/66/4a/0c664ad974914d5f19dae35bd5cb3808.gif';

  return (
    <div className="rounded-full">
      <Image
        src={videoSrc}
        alt="Image"
        width={450}
        height={250}
      />
    </div>
  );
};

export default Video;
