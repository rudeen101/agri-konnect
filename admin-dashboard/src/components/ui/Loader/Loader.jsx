import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

// Animation definitions
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const progress = keyframes`
  0% { width: 0%; left: 0%; right: 100%; }
  50% { width: 100%; left: 0%; right: 0%; }
  100% { width: 0%; left: 100%; right: 0%; }
`;

// Styled components
const SpinnerBase = styled.div`
  display: inline-block;
  border-radius: 50%;
  animation: ${spin} 1.2s linear infinite;
  border-style: solid;
  border-color: #1a73e8;
  border-bottom-color: transparent;
`;

const Dot = styled.div`
  width: ${({ size }) => size * 0.25}px;
  height: ${({ size }) => size * 0.25}px;
  border-radius: 50%;
  background-color: #1a73e8;
  animation: ${pulse} 1.4s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const ProgressTrack = styled.div`
  position: relative;
  width: 100%;
  height: ${({ thickness }) => thickness}px;
  background-color: #1a73e8;
  border-radius: ${({ thickness }) => thickness / 2}px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  position: absolute;
  height: 100%;
  border-radius: ${({ thickness }) => thickness / 2}px;
  background-color: #1a73e8;
  animation: ${progress} ${({ speed }) => speed}s ease-in-out infinite;
`;

// Loader variants
const Spinner = ({ size = 40, thickness = 4, color }) => (
  <SpinnerBase
    style={{
      width: size,
      height: size,
      borderWidth: thickness,
      borderColor: color,
      borderBottomColor: 'transparent'
    }}
    aria-label="Loading spinner"
  />
);

const Dots = ({ size = 40, color }) => (
  <div style={{ display: 'flex', gap: size * 0.2 }}>
    {[0, 0.2, 0.4].map((delay) => (
      <Dot
        key={delay}
        size={size}
        delay={delay}
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
);

const Linear = ({ thickness = 4, speed = 2, color }) => (
  <ProgressTrack thickness={thickness}>
    <ProgressBar 
      thickness={thickness}
      speed={speed}
      style={{ backgroundColor: color }}
    />
  </ProgressTrack>
);

// Main Loader component
const Loader = ({
  variant = 'spinner',
  size = 40,
  thickness = 4,
  speed = 2,
  color,
  fullscreen = false,
  overlay = true,
  message
}) => {
  const loaderVariant = {
    spinner: <Spinner size={size} thickness={thickness} color={color} />,
    dots: <Dots size={size} color={color} />,
    linear: <Linear thickness={thickness} speed={speed} color={color} />
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        position: fullscreen ? 'fixed' : 'static',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: fullscreen ? 9999 : 'auto',
        backgroundColor: overlay ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
        padding: fullscreen ? '2rem' : '0'
      }}
      role="status"
      aria-live="polite"
    >
      {loaderVariant[variant]}
      {message && (
        <p style={{ 
          color: color || 'inherit',
          marginTop: '1rem',
          fontSize: size * 0.3
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

Loader.propTypes = {
  variant: PropTypes.oneOf(['spinner', 'dots', 'linear']),
  size: PropTypes.number,
  thickness: PropTypes.number,
  speed: PropTypes.number,
  color: PropTypes.string,
  fullscreen: PropTypes.bool,
  overlay: PropTypes.bool,
  message: PropTypes.string
};

export default Loader;



// Features and Usage

//  Three Loading Variants
// <Loader variant="spinner" />  // Classic circular spinner (default)
// <Loader variant="dots" />     // Three bouncing dots
// <Loader variant="linear" />   // Animated progress bar


// 2. Customization Options
// <Loader 
//   size={60}                   // Controls overall size
//   thickness={6}               // For spinner/linear variants
//   speed={1.5}                 // Animation speed
//   color="#4cc9f0"             // Custom color
//   message="Loading data..."   // Optional text
// />

// 3. Layout Modes
// <Loader fullscreen />         // Covers entire viewport
// <Loader overlay={false} />    // No background overlay
// <Loader /> 