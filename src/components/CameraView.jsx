import React, { useRef, useState, useCallback } from 'react';
import { useCamera } from '../hooks/useCamera';
import { FILTERS } from '../filters';
import './CameraView.css';

export default function CameraView({ onPhotoTaken, photoCount }) {
  const canvasRef = useRef(null);
  const { videoRef, camReady, camError } = useCamera(true);

  const [filterIndex, setFilterIndex] = useState(0);
  const [isMirrored, setIsMirrored] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [countdown, setCountdown] = useState(null); // null = hidden, 1/2/3 = showing
  const [flash, setFlash] = useState(false);

  const currentFilter = FILTERS[filterIndex];

  // ---- FILTER NAV ----
  const nextFilter = () => setFilterIndex((i) => (i + 1) % FILTERS.length);
  const prevFilter = () => setFilterIndex((i) => (i - 1 + FILTERS.length) % FILTERS.length);

  // ---- CAPTURE ----
  const doCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (isMirrored) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (isMirrored) ctx.restore();

    FILTERS[filterIndex].apply(ctx, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');

    // Flash effect
    setFlash(true);
    setTimeout(() => setFlash(false), 120);

    onPhotoTaken(imageData);
  }, [videoRef, filterIndex, isMirrored, onPhotoTaken]);

  const startCountdown = useCallback((n) => {
    if (n === 0) {
      setCountdown(null);
      doCapture();
      return;
    }
    setCountdown(n);
    setTimeout(() => startCountdown(n - 1), 1000);
  }, [doCapture]);

  const handleCapture = () => {
    if (photoCount >= 3) return;
    if (timerOn) {
      startCountdown(3);
    } else {
      doCapture();
    }
  };

  const handleTimerToggle = () => setTimerOn((v) => !v);
  const handleMirrorToggle = () => setIsMirrored((v) => !v);

  return (
    <div className="app-page">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">FotoForFun</h1>
        <div className="header-btns">
          <button
            className={`icon-btn${isMirrored ? ' active' : ''}`}
            onClick={handleMirrorToggle}
            title="Flip Camera"
          >
            <img src="/invert.png" alt="flip" />
          </button>
          <button
            className={`icon-btn${timerOn ? ' active' : ''}`}
            onClick={handleTimerToggle}
            title="Self Timer 3s"
          >
            <img src="/clock.png" alt="timer" />
          </button>
        </div>
      </header>

      {/* Camera */}
      <div className="camera-section">
        <div className="video-wrapper">

          {/* Camera status overlay */}
          {!camReady && !camError && (
            <div className="cam-status">
              <div className="cam-spinner" />
              <span>INITIALIZING CAMERA</span>
            </div>
          )}
          {camError && (
            <div className="cam-status">
              <span className="cam-error">CAMERA UNAVAILABLE</span>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              filter: currentFilter.cssFilter,
              transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)',
            }}
          />

          {/* Flash overlay */}
          <div className={`flash-overlay${flash ? ' visible' : ''}`} />

          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="countdown-overlay">{countdown}</div>
          )}

          {/* Corner decorations */}
          <div className="corner tl" /><div className="corner tr" />
          <div className="corner bl" /><div className="corner br" />

          {/* Filter bar */}
          <div className="filter-bar">
            <button className="filter-nav-btn left" onClick={prevFilter}>
              <img src="/button.png" alt="prev" />
            </button>
            <div className="filter-name">{currentFilter.name}</div>
            <button className="filter-nav-btn right" onClick={nextFilter}>
              <img src="/button.png" alt="next" style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="bottom-controls">
        <div className="photo-counter">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`counter-dot${i < photoCount ? ' filled' : ''}`} />
          ))}
        </div>
        <button
          className="capture-btn"
          onClick={handleCapture}
          disabled={photoCount >= 3 || countdown !== null}
        >
          ⬤ Capture
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
