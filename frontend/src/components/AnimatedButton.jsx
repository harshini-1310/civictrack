import styled from 'styled-components';

const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  simple = false,
  fullWidth = false,
  compact = false,
  iconOnly = false
}) => {
  const colors = {
    primary: {
      main: '#3b82f6',
      hover: '#1e40af',
      text: '#ffffff'
    },
    secondary: {
      main: '#10b981',
      hover: '#065f46',
      text: '#ffffff'
    },
    danger: {
      main: '#ef4444',
      hover: '#991b1b',
      text: '#ffffff'
    },
    white: {
      main: '#ffffff',
      hover: '#0f172a',
      text: '#0f172a'
    },
    outline: {
      main: '#3b82f6',
      hover: '#3b82f6',
      text: '#ffffff'
    }
  };

  const color = colors[variant] || colors.primary;

  if (simple) {
    return (
      <SimpleWrapper $color={color} $fullWidth={fullWidth} $compact={compact} $iconOnly={iconOnly} className={className}>
        <button
          className="simple-button"
          onClick={onClick}
          type={type}
          disabled={disabled}
        >
          <span className="text">{children}</span>
          <span className="circle" />
        </button>
      </SimpleWrapper>
    );
  }

  return (
    <StyledWrapper $color={color} $fullWidth={fullWidth} $compact={compact} $iconOnly={iconOnly} className={className}>
      <button
        className="animated-button"
        onClick={onClick}
        type={type}
        disabled={disabled}
      >
        <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <span className="text">{children}</span>
        <span className="circle" />
        <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const SimpleWrapper = styled.div`
  display: ${props => props.$fullWidth ? 'block' : 'inline-block'};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  .simple-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: ${props => props.$iconOnly ? '0' : '8px'};
    padding: ${props => props.$iconOnly ? '10px' : props.$compact ? '10px 18px' : '16px 36px'};
    border: none;
    font-size: ${props => props.$compact ? '14px' : '16px'};
    background-color: ${props => props.$color.main};
    border-radius: ${props => props.$iconOnly ? '999px' : '16px'};
    font-weight: 600;
    color: ${props => props.$color.text};
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .simple-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .simple-button .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .simple-button .text {
    position: relative;
    z-index: 1;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .simple-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 40px ${props => props.$color.main}40;
  }

  .simple-button:hover:not(:disabled) .text {
    transform: scale(1.02);
  }

  .simple-button:active:not(:disabled) {
    transform: scale(0.98);
  }

  .simple-button:hover:not(:disabled) .circle {
    width: 300px;
    height: 300px;
    opacity: 1;
  }
`;

const StyledWrapper = styled.div`
  display: ${props => props.$fullWidth ? 'block' : 'inline-block'};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  .animated-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: ${props => props.$iconOnly ? '0' : '4px'};
    padding: ${props => props.$iconOnly ? '10px' : props.$compact ? '10px 18px' : '16px 36px'};
    border: 4px solid transparent;
    font-size: 16px;
    background-color: transparent;
    border-radius: ${props => props.$iconOnly ? '999px' : '100px'};
    font-weight: 600;
    font-size: ${props => props.$compact ? '14px' : '16px'};
    color: ${props => props.$color.main};
    box-shadow: 0 0 0 2px ${props => props.$color.main};
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .animated-button svg {
    position: absolute;
    width: 24px;
    fill: ${props => props.$color.main};
    z-index: 9;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .arr-1 {
    right: 16px;
    display: ${props => props.$iconOnly ? 'none' : 'block'};
  }

  .animated-button .arr-2 {
    left: -25%;
    display: ${props => props.$iconOnly ? 'none' : 'block'};
  }

  .animated-button .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: ${props => props.$color.main};
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .text {
    position: relative;
    z-index: 1;
    transform: ${props => props.$iconOnly ? 'none' : 'translateX(-12px)'};
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button:hover:not(:disabled) {
    box-shadow: 0 0 0 12px transparent;
    color: ${props => props.$color.text};
    border-radius: 16px;
  }

  .animated-button:hover:not(:disabled) .arr-1 {
    right: -25%;
  }

  .animated-button:hover:not(:disabled) .arr-2 {
    left: 16px;
  }

  .animated-button:hover:not(:disabled) .text {
    transform: ${props => props.$iconOnly ? 'none' : 'translateX(12px)'};
  }

  .animated-button:hover:not(:disabled) svg {
    fill: ${props => props.$color.text};
  }

  .animated-button:active:not(:disabled) {
    scale: 0.95;
    box-shadow: 0 0 0 4px ${props => props.$color.main};
  }

  .animated-button:hover:not(:disabled) .circle {
    width: 220px;
    height: 220px;
    opacity: 1;
  }
`;

export default AnimatedButton;
