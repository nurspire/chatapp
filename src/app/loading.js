// components/LoadingAnimation.js
'use client';

import './LoadingAnimation.css'; // Import your CSS file

const LoadingAnimation = () => {
  const text = 'VERSANEX';

  return (
    <div className="containerr">
      <div className="glow"></div>
      {text.split('').map((letter, index) => (
        <div key={index} className="letter-container">
          <div
            className="string"
            style={{
              left: `${index * 40 + 20}px`,
              animationDelay: `${index * 0.1}s`,
            }}
          ></div>
          <span
            className="letter"
            style={{
              animationDelay: `${index * 0.1 + 0.5}s`,
            }}
          >
            {letter}
          </span>
        </div>
      ))}
    </div>
  );
};

export default LoadingAnimation;
