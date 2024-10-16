import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useSpring, animated } from 'react-spring';

const WheelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e1e 0%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;
`;

const WheelWrapper = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
`;

const Wheel = styled(animated.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 0 15px #ffd700,
    0 0 0 30px #e6b800,
    0 0 50px rgba(255, 215, 0, 0.7),
    0 0 100px rgba(255, 215, 0, 0.5);
`;

const shine = keyframes`
  0% { background-position: -100px; }
  20% { background-position: 100px; }
  100% { background-position: 100px; }
`;

const Segment = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 200px 100px 0;
  border-color: ${props => props.color} transparent transparent transparent;
  transform-origin: 100px 200px;
  left: 100px;
  top: 0;
  transform: rotate(${props => props.rotate}deg);
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.isWinner && css`
    &::after {
      content: '';
      position: absolute;
      top: -200px;
      left: -100px;
      width: 200px;
      height: 200px;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent);
      transform: rotate(30deg);
      animation: ${shine} 1.5s linear infinite;
    }
  `}
`;

const SegmentText = styled.span`
  position: absolute;
  top: -140px;
  left: -20px;
  transform: rotate(-${props => props.rotate}deg);
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Pointer = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 40px solid #ffd700;
  z-index: 100;
`;

const Button = styled.button`
  position: absolute;
  bottom: 50px;
  font-size: 1.5rem;
  padding: 15px 30px;
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  border: none;
  border-radius: 50px;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    background: linear-gradient(45deg, #ffe066, #ff8c8c);
  }

  &:active {
    transform: translateY(1px) scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const WinnerAnnouncement = styled.div`
  position: absolute;
  top: 50px;
  font-size: 2rem;
  color: #ffd700;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const NavigationButton = styled(Link)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background: #4ecdc4;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #45b7d1;
  }
`;

const SpinningWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [names, setNames] = useState([]);

  useEffect(() => {
    const storedNames = localStorage.getItem('wheelNames');
    if (storedNames) {
      setNames(JSON.parse(storedNames));
    }
  }, []);

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7d794', '#ff8a5c', '#7fb069', '#d88c9a', '#3c3c3c'];

  const spinAnimation = useSpring({
    from: { rotate: rotation },
    to: { rotate: isSpinning ? rotation + 2160 + Math.random() * 360 : rotation },
    config: isSpinning 
      ? { 
          duration: 8000, 
          easing: t => 
            t === 1 ? 1 : 1 - Math.pow(2, -10 * t) // Exponential easing out
        } 
      : { duration: 100000 },
    onRest: () => {
      if (isSpinning) {
        setIsSpinning(false);
        const winningIndex = Math.floor(((rotation % 360) / 360) * names.length);
        setWinner(names[winningIndex]);
      }
    },
  });

  const spinWheel = () => {
    if (!isSpinning && names.length > 0) {
      setIsSpinning(true);
      setWinner(null);
      setRotation(prevRotation => prevRotation + 2160 + Math.random() * 360);
    }
  };

  return (
    <WheelContainer>
      <NavigationButton to="/">Edit Names</NavigationButton>
      {winner && (
        <WinnerAnnouncement>
          Winner: {winner}
        </WinnerAnnouncement>
      )}
      <WheelWrapper>
        <Pointer />
        <Wheel style={spinAnimation}>
          {names.map((name, index) => (
            <Segment 
              key={index} 
              color={colors[index % colors.length]} 
              rotate={index * (360 / names.length)}
              isWinner={!isSpinning && winner === name}
            >
              <SegmentText rotate={index * (360 / names.length)}>
                {name}
              </SegmentText>
            </Segment>
          ))}
        </Wheel>
      </WheelWrapper>
      <Button onClick={spinWheel} disabled={isSpinning || names.length === 0}>
        {isSpinning ? 'Spinning...' : 'SPIN & WIN!'}
      </Button>
    </WheelContainer>
  );
};

export default SpinningWheel;