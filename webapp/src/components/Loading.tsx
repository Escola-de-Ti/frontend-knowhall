import React from 'react';
import '../styles/Loading.css';

type LoadingProps = {
  fullscreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function Loading({ fullscreen = false, message, size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'loading-spinner--sm',
    md: 'loading-spinner--md',
    lg: 'loading-spinner--lg',
  };

  if (fullscreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className={`loading-spinner ${sizeClasses[size]}`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className={`loading-spinner ${sizeClasses[size]}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}