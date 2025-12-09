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
  const [videoPlaying, setVideoPlaying] = useState(false);
  const { setVideoEnded: setGlobalVideoEnded } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const showContent = () => {
    setVideoEnded(true);
    setGlobalVideoEnded(true);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl) {
      // Reset all states when video URL changes
      setVideoEnded(false);
      setVideoError(false);
      setVideoPlaying(false);
      setGlobalVideoEnded(false);
      
      // Set a timeout fallback - if video doesn't load in 5 seconds, show content
      const timeoutId = setTimeout(() => {
        if (!videoEnded && !videoError && !videoPlaying) {
          console.warn('Video loading timeout, showing content');
          setVideoError(true);
          showContent();
        }
      }, 5000);

      // Wait for video to be ready to play
      const handleCanPlay = () => {
        // Try to play video
        video.play().then(() => {
          setVideoPlaying(true);
        }).catch(err => {
          console.error('Error playing video:', err);
          setVideoError(true);
          showContent();
        });
      };

      const handlePlaying = () => {
        setVideoPlaying(true);
      };

      const handleError = () => {
        console.error('Video failed to load');
        setVideoError(true);
        showContent();
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('error', handleError);

      // Load video
      video.load();

      return () => {
        clearTimeout(timeoutId);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('error', handleError);
      };
    } else {
      // No video, wait for image to load first
      if (!videoUrl) {
        // If no video, we still want to wait for image
        // Image loading will trigger content display
      }
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

  // Determine if content should be visible
  // Only show content when:
  // 1. Video is playing and has ended, OR
  // 2. Video error occurred and image is loaded, OR
  // 3. No video and image is loaded
  const shouldShowContent = 
    (videoUrl && videoPlaying && videoEnded) ||
    (videoUrl && videoError && imageLoaded) ||
    (!videoUrl && imageLoaded);

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
            style={{
              opacity: videoPlaying ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
        
        {/* Image background - shows after video ends or if no video */}
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt="Background"
          loading="eager"
          decoding="async"
          onLoad={() => {
            setImageLoaded(true);
            // If no video, show content when image loads
            if (!videoUrl) {
              showContent();
            }
          }}
          style={{ 
            opacity: (videoEnded || !videoUrl || videoError) && imageLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            position: videoUrl && !videoEnded && !videoError ? 'absolute' : 'relative'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85"></div>
      </div>
      {/* Content - only visible when conditions are met, no flashing */}
      <motion.div 
        className="relative h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldShowContent ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          visibility: shouldShowContent ? 'visible' : 'hidden'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}; 
