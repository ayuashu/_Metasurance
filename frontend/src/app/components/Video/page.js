"use client"
import React, { useRef } from 'react';
import ReactPlayer from 'react-player';

const Video = () => {
  const videoSrc = '/Videos/myvideo.mp4';
  const playerRef = useRef(null);

  const handleVideoProgress = ({ playedSeconds, loadedSeconds }) => {
    // Check if the video has reached the end and manually restart it
    if (playedSeconds >= loadedSeconds) {
      playerRef.current.seekTo(0); // Restart the video
    }
  };

  return (
    <div className="rounded-full">
      <ReactPlayer
        ref={playerRef}
        url={videoSrc}
        playing={true}
        muted={true}
        controls={true}
        width={450}
        height={250}
        onProgress={handleVideoProgress} // Call the event handler on video progress
      />
    </div>
  );
};

export default Video;
