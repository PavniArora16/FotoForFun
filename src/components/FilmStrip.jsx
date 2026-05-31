import React, { useRef, useEffect } from 'react';
import { createStripImage, downloadImage, shareImage } from '../utils/stripExport';
import './FilmStrip.css';

const SPROCKET_COUNT = 18;

export default function FilmStrip({ photos, onTryAgain, notify }) {
  const stripRef = useRef(null);

  useEffect(() => {
    // Scroll to strip on mount
    setTimeout(() => {
      stripRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    notify('YOUR STRIP IS READY!');
  }, []); // eslint-disable-line

  const handleDownloadStrip = async () => {
    const dataUrl = await createStripImage(photos);
    downloadImage(dataUrl, 'fotoforfun_strip.png');
  };

  const handleShareStrip = async () => {
    const dataUrl = await createStripImage(photos);
    shareImage(dataUrl, 'fotoforfun_strip.png');
  };

  const handleDownloadPhoto = (src, i) => downloadImage(src, `fotoforfun_photo_${i + 1}.png`);
  const handleSharePhoto = (src, i) => shareImage(src, `fotoforfun_photo_${i + 1}.png`);

  const sprockets = Array.from({ length: SPROCKET_COUNT });

  return (
    <div className="strip-page" ref={stripRef}>
      <header className="app-header">
        <h1 className="app-title">FotoForFun</h1>
      </header>

      <div className="strip-container">
        <h2 className="strip-heading">🎞 Your Film Strip</h2>

        <div className="film-strip-outer">
          {/* Top sprockets */}
          <div className="sprockets">
            {sprockets.map((_, i) => <div key={i} className="sprocket" />)}
          </div>

          {/* Top label */}
          <div className="film-label">
            <span>FotoForFun</span>
            <span>ISO 400 ✦ 35mm</span>
            <span>{new Date().getFullYear()}</span>
          </div>

          {/* Photo frames */}
          <div className="film-frames-row">
            {photos.map((src, i) => (
              <div key={i} className="film-frame">
                <img src={src} alt={`Photo ${i + 1}`} />
                <div className="frame-num">▲ {i + 1}</div>
              </div>
            ))}
          </div>

          {/* Bottom label */}
          <div className="film-label">
            <span>✦ 1 ✦ 2 ✦ 3 ✦</span>
            <span>Do Not Bend</span>
            <span>FotoForFun ©</span>
          </div>

          {/* Bottom sprockets */}
          <div className="sprockets">
            {sprockets.map((_, i) => <div key={i} className="sprocket" />)}
          </div>
        </div>

        {/* Per-photo actions */}
        <div className="photo-actions-row">
          {photos.map((src, i) => (
            <div key={i} className="photo-action-card">
              <span className="photo-action-label">Photo {i + 1}</span>
              <div className="photo-action-btns">
                <button className="action-btn" onClick={() => handleDownloadPhoto(src, i)}>↓</button>
                <button className="action-btn" onClick={() => handleSharePhoto(src, i)}>↑</button>
              </div>
            </div>
          ))}
        </div>

        {/* Strip actions */}
        <div className="strip-actions">
          <button className="action-btn wide" onClick={handleDownloadStrip}>↓ Download Strip</button>
          <button className="action-btn wide" onClick={handleShareStrip}>↑ Share Strip</button>
        </div>

        <button className="try-again-btn" onClick={onTryAgain}>
          ↺ Try Again — New Strip
        </button>
      </div>
    </div>
  );
}
