"use client"
import React, { useRef } from 'react';

const Video = () => {
  const videoSrc = '/Videos/myvideo.mp4';
  const videoRef = useRef(null);

  const handleVideoEnded = () => {
    videoRef.current.currentTime = 0; // Restart the video
  };

  return (
    <div className="rounded-full">
      <video
        src={videoSrc}
        controls
        autoPlay // Autoplay the video
        muted // Mute the video by default
        width={450}
        height={250}
        onEnded={handleVideoEnded} // Call the event handler when the video ends
        ref={videoRef}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
