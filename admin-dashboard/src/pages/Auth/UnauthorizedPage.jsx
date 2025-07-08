import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoHome = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="error-code">403</div>
        <h1 className="error-title">Access Denied</h1>
        <p className="error-message">
          You don't have permission to access this page.
        </p>
        <div className="action-buttons">
          <button onClick={handleGoBack} className="btn back-btn">
            Go Back
          </button>
          <button onClick={handleGoHome} className="btn home-btn">
            Go to Homepage
          </button>
        </div>
        <div className="error-illustration">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="150"
            height="150"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;