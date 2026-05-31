import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import CameraView from './components/CameraView';
import FilmStrip from './components/FilmStrip';
import Toast from './components/Toast';
import { useNotify } from './hooks/useNotify';


export default function App() {
  const [page, setPage] = useState('landing');
  const [photos, setPhotos] = useState([]);
  const { message, notify } = useNotify();

  const handleStart = useCallback(() => {
    setPage('camera');
    window.scrollTo(0, 0);
  }, []);

  const handlePhotoTaken = useCallback((imageData) => {
    setPhotos((prev) => {
      const next = [...prev, imageData];
      if (next.length === 3) {
        // Short delay so the 3rd flash completes before switching views
        setTimeout(() => setPage('strip'), 400);
      } else {
        notify(`PHOTO ${next.length} / 3 CAPTURED`);
      }
      return next;
    });
  }, [notify]);

  const handleTryAgain = useCallback(() => {
    setPhotos([]);
    setPage('camera');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notify('NEW STRIP — GO!');
  }, [notify]);

  return (
    <>
      {page === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}

      {page === 'camera' && (
        <CameraView
          photoCount={photos.length}
          onPhotoTaken={handlePhotoTaken}
        />
      )}

      {page === 'strip' && (
        <FilmStrip
          photos={photos}
          onTryAgain={handleTryAgain}
          notify={notify}
        />
      )}

      <Toast message={message} />
    </>
  );
}
