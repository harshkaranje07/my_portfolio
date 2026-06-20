import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Crash Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%', 
          width: '100%', 
          background: 'transparent',
          color: 'var(--yellow)',
          fontFamily: 'monospace',
          border: '1px solid rgba(250, 204, 21, 0.2)',
          padding: '2rem'
        }}>
          <div>[SYSTEM FAULT] MODULE RENDER FAILED. REBOOTING SECTOR.</div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
