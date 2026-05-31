import { useEffect, useRef, useState } from 'react';

/**
 * useCamera
 * Manages webcam stream lifecycle.
 * Returns { videoRef, camReady, camError }
 */
export function useCamera(active) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState(false);

  useEffect(() => {
    if (!active) return;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setCamReady(true);
        }
      })
      .catch(() => setCamError(true));

    return () => {
      // Stop all tracks when component unmounts or active goes false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [active]);

  return { videoRef, camReady, camError };
}
