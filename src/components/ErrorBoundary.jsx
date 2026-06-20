import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      prevResetKey: props.resetKey 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.prevResetKey) {
      return {
        hasError: false,
        prevResetKey: props.resetKey
      };
    }
    return null;
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Crash Caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.isGlobal) {
        return (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            width: '100vw', 
            background: '#050505',
            color: '#FACC15',
            fontFamily: 'monospace',
            padding: '2rem',
            boxSizing: 'border-box',
            textAlign: 'center',
            position: 'fixed',
            inset: 0,
            zIndex: 999999
          }}>
            <div style={{
              border: '1px solid rgba(250, 204, 21, 0.3)',
              background: 'rgba(10, 10, 10, 0.8)',
              padding: '3rem',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 0 30px rgba(250, 204, 21, 0.1)',
            }}>
              <h2 style={{ fontSize: '1.4rem', letterSpacing: '4px', margin: '0 0 1.5rem 0', fontWeight: 'bold' }}>
                SYSTEM RECOVERY ACTIVE
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#fff', opacity: 0.8, lineHeight: 1.6, margin: '0 0 2rem 0' }}>
                A rendering issue was detected.<br />
                The interface is being restored.
              </p>
              <button 
                onClick={this.handleReload}
                style={{
                  background: 'rgba(250, 204, 21, 0.15)',
                  border: '1px solid #FACC15',
                  color: '#FACC15',
                  padding: '0.8rem 2rem',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(250, 204, 21, 0.25)';
                  e.target.style.boxShadow = '0 0 15px rgba(250, 204, 21, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(250, 204, 21, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                [ Reload Module ]
              </button>
            </div>
          </div>
        );
      }

      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%', 
          width: '100%', 
          background: 'transparent',
          color: '#FACC15',
          fontFamily: 'monospace',
          border: '1px solid rgba(250, 204, 21, 0.15)',
          padding: '3rem',
          boxSizing: 'border-box',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '0.9rem', 
            letterSpacing: '3px', 
            fontWeight: 'bold',
            lineHeight: 2
          }}>
            SYSTEM RECOVERING...<br />
            LOADING MODULE...
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
