import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Music from "../audio/Music.mp3";
import { gsap } from "gsap";
import Noise from "../effects/Noise";

const BackgroundMusicLayout = () => {
  const audioRef = useRef(null);
  const volumeControlRef = useRef(null);
  const tooltipRef = useRef(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [volumeControlVisible, setVolumeControlVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleStartMusic = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.volume = volume;
        await audioRef.current.play();
        setMusicStarted(true);
        setOverlayVisible(false);
      }
    } catch (error) {
      console.error("Audio play error:", error);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current && (audioRef.current.volume = newVolume);
  };

  // GSAP Animations
  useEffect(() => {
    if (overlayVisible) {
      gsap.fromTo(
        ".overlay",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    if (volumeControlRef.current) {
      const tl = gsap.timeline();
      volumeControlVisible ?
        tl.to(volumeControlRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)"
        }) :
        tl.to(volumeControlRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: "power2.in"
        });
    }

    if (tooltipRef.current) {
      gsap.to(tooltipRef.current, {
        opacity: showTooltip ? 1 : 0,
        y: showTooltip ? -5 : 0,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  }, [overlayVisible, volumeControlVisible, showTooltip]);

  return (
    <>
      <audio ref={audioRef} src={Music} loop style={{ display: "none" }} />

      {/* Overlay */}
      {overlayVisible && (
        <div className="overlay fixed inset-0 bg-gradient-to-br from-teal-500 to-teal-900 flex flex-col items-center justify-center z-50">
          <Noise
            patternSize={250}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={2}
            patternAlpha={15}
          />
          <h1 className="text-white text-4xl font-bold mb-8 text-center px-4">
            Wait! Play Background Music First 🎵
          </h1>
          <button
            onClick={handleStartMusic}
            className="px-8 py-4 bg-[#fdd401] hover:bg-amber-400 text-teal-900 font-bold rounded-full 
              text-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 z-50"
          >
            Start Musical Journey
          </button>
        </div>
      )}

      {/* Volume Controls */}
      <div className="fixed bottom-4 right-4 flex items-end gap-2 z-50">
        {musicStarted && (
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* Tooltip */}
            <div
              ref={tooltipRef}
              className="absolute bottom-full -right-2 mb-2 px-3 py-2 bg-white/10 backdrop-blur-sm 
                border border-white/20 rounded-lg text-sm text-[#fdd401] font-medium shadow-lg"
              style={{ opacity: 0 }}
            >
              Adjust Music Volume
              <div className="absolute top-full right-3 w-3 h-3 bg-white/10 backdrop-blur-sm 
                border-r border-b border-white/20 transform rotate-45 -translate-y-1.5" />
            </div>

            {/* Volume Button */}
            <button
              onClick={() => setVolumeControlVisible(!volumeControlVisible)}
              className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full 
                hover:bg-white/20 transition-all shadow-lg"
            >
              <svg className="w-6 h-6 text-[#fdd401]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15.536 8.464a5 5 0 010 7.072M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>
          </div>
        )}

        {/* Volume Slider */}
        <div ref={volumeControlRef} className="origin-bottom-right">
          {volumeControlVisible && (
            <div className="bg-white/10 backdrop-blur-lg px-4 py-3 rounded-xl border border-white/20 
              shadow-xl flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32 h-1 bg-white/20 rounded-full appearance-none cursor-pointer 
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:bg-[#fdd401] [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:appearance-none"
              />
              <span className="text-sm font-medium text-[#fdd401] w-8">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="relative">
        <Outlet />
      </div>
    </>
  );
};

export default BackgroundMusicLayout;