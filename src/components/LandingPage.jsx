import React from 'react';
import './LandingPage.css';

export default function LandingPage({ onStart }) {
  const holes = Array.from({ length: 7 });

  return (
    <div className="landing">
      <div className="film-holes">
        {holes.map((_, i) => <span key={i} />)}
      </div>

      <h1 className="landing-title">
        FotoFor<br />Fun
      </h1>

      <p className="tagline">Strike a pose. Click. Repeat.</p>

      <button className="start-btn" onClick={onStart}>
        Start The Fun →
      </button>

      <div className="film-holes">
        {holes.map((_, i) => <span key={i} />)}
      </div>
    </div>
  );
}
