import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVideoStore } from '../../stores/videoStore';

interface ParallaxHeroProps {
  children: React.ReactNode;
  imageUrl: string;
  videoUrl?: string;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({ children, imageUrl, videoUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const { setVideoEnded: setGlobalVideoEnded } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl) {
      // Reset video state when video URL changes
      setVideoEnded(false);
      setGlobalVideoEnded(false);
      video.play().catch(err => {
        console.error('Error playing video:', err);
        // If video fails, show content immediately
        setVideoEnded(true);
        setGlobalVideoEnded(true);
      });
    } else {
      // No video, show content immediately
      setVideoEnded(true);
      setGlobalVideoEnded(true);
    }
  }, [videoUrl, setGlobalVideoEnded]);

  const handleVideoEnd = () => {
    // Show image background after video ends
    setVideoEnded(true);
    setGlobalVideoEnded(true);
    // Hide video and show image
    if (videoRef.current) {
      videoRef.current.style.display = 'none';
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
      <div className="absolute inset-0">
        {/* Video background - plays first if videoUrl is provided */}
        {videoUrl && !videoEnded && (
          <video
            ref={videoRef}
            className="w-full h-full object-contain sm:object-contain md:object-cover"
            playsInline
            muted
            onEnded={handleVideoEnd}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
        
        {/* Image background - shows after video ends or if no video */}
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt="Background"
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          style={{ 
            opacity: (videoEnded || !videoUrl) && imageLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            position: videoUrl && !videoEnded ? 'absolute' : 'relative'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85"></div>
      </div>
      <motion.div 
        className="relative h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: videoEnded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: videoEnded ? 0 : 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
}; 