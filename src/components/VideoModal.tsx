import React, { useEffect, useRef, useState } from 'react';
import { WorkProject } from '../types';

interface VideoModalProps {
  work: WorkProject | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ work, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!work) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      videoRef.current.currentTime = pct * videoRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const videoSource = work.video || work.mobileVideo || 'https://d2rb54pmpxhpry.cloudfront.net/wings-v8_1080p.mp4';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Video Player"
    >
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#859099] font-medium">
            {work.client || 'Preymaker'}
          </p>
          <h2 className="text-lg md:text-2xl font-semibold tracking-tight text-white">
            {work.title}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="heading-xxs uppercase tracking-widest px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 focus:outline-none flex items-center space-x-2"
          aria-label="Close video"
        >
          <span>Close</span>
          <span className="text-xs">✕</span>
        </button>
      </div>

      {/* Main Video Viewport */}
      <div className="relative w-full h-full flex items-center justify-center p-2 md:p-12">
        <video
          ref={videoRef}
          src={videoSource}
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          className="max-w-full max-h-[85vh] w-auto h-auto object-contain cursor-pointer shadow-2xl"
        />
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col space-y-3">
        {/* Progress Bar */}
        <div
          onClick={handleSeek}
          className="w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer relative transition-all group"
        >
          <div
            className="h-full bg-white rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Buttons & Time */}
        <div className="flex items-center justify-between text-xs md:text-sm font-medium">
          <div className="flex items-center space-x-6">
            <button
              onClick={togglePlay}
              className="uppercase tracking-wider hover:text-white/70 transition-colors focus:outline-none"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={toggleMute}
              className="uppercase tracking-wider hover:text-white/70 transition-colors focus:outline-none"
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <span className="text-[#859099] tracking-wider font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-[#859099]">
            {work.services.map((s) => (
              <span key={s} className="uppercase tracking-wider">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

