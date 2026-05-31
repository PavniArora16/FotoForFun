import { useState, useCallback, useRef } from 'react';

/**
 * useNotify
 * Returns { message, notify }
 * Call notify('TEXT') to show a toast for 2 seconds.
 */
export function useNotify() {
  const [message, setMessage] = useState('');
  const timerRef = useRef(null);

  const notify = useCallback((msg) => {
    setMessage(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(''), 2000);
  }, []);

  return { message, notify };
}
