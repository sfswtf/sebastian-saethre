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
  const [videoError, setVideoError] = useState(false);
  const { setVideoEnded: setGlobalVideoEnded } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const showContent = () => {
    setVideoEnded(true);
    setGlobalVideoEnded(true);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl) {
      // Reset video state when video URL changes
      setVideoEnded(false);
      setVideoError(false);
      setGlobalVideoEnded(false);
      
      // Set a timeout fallback - if video doesn't load in 5 seconds, show content
      const timeoutId = setTimeout(() => {
        if (!videoEnded && !videoError) {
          // Silently show content if video times out (expected behavior)
          showContent();
        }
      }, 5000);

      // Try to load and play video
      video.load();
      video.play().catch(err => {
        console.error('Error playing video:', err);
        // If video fails, show content immediately
        setVideoError(true);
        showContent();
      });

      return () => clearTimeout(timeoutId);
    } else {
      // No video, show content immediately
      showContent();
    }
  }, [videoUrl, setGlobalVideoEnded]);

  const handleVideoEnd = () => {
    // Show image background after video ends
    showContent();
    // Hide video and show image
    if (videoRef.current) {
      videoRef.current.style.display = 'none';
    }
  };

  const handleVideoError = () => {
    console.error('Video failed to load');
    setVideoError(true);
    showContent();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
      <div className="absolute inset-0">
        {/* Video background - plays first if videoUrl is provided */}
        {videoUrl && !videoEnded && !videoError && (
          <video
            ref={videoRef}
            className="w-full h-full object-contain sm:object-contain md:object-cover"
            playsInline
            muted
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            preload="auto"
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
            opacity: (videoEnded || !videoUrl || videoError) && imageLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            position: videoUrl && !videoEnded && !videoError ? 'absolute' : 'relative'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85"></div>
      </div>
      <motion.div 
        className="relative h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: (videoEnded || !videoUrl || videoError) && imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}; 