import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useSpring, animated } from 'react-spring';

const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1e1e 0%, #0a0a0a 100%);
  padding: 20px;
  color: #ffd700;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const WheelWrapper = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 20px 0;
`;

const Wheel = styled(animated.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 15px #ffd700, 0 0 0 30px #e6b800, 0 0 50px rgba(255, 215, 0, 0.7);
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
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
      transform: rotate(30deg);
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
  font-size: 16px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
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

const spinButton = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background: #ffd700;
  border: none;
  border-radius: 5px;
  color: #1a1a1a;
  cursor: pointer;
  transition: background 0.3s;
  animation: ${spinButton} 2s infinite;

  &:hover {
    background: #ffed4a;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    animation: none;
  }
`;

const WinnerAnnouncement = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid #ffd700;
  border-radius: 10px;
  text-align: center;
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

const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7d794', '#ff8a5c', '#7fb069', '#d88c9a', '#3c3c3c'];

// Define the pointer position explicitly
const POINTER_POSITION = 0; // 0 degrees is the top (12 o'clock) position

const SpinningWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [names, setNames] = useState([]);
  const [predeterminedWinner, setPredeterminedWinner] = useState(null);

  useEffect(() => {
    const storedNames = localStorage.getItem('wheelNames');
    const storedWinner = localStorage.getItem('wheelWinner');
    if (storedNames) {
      setNames(JSON.parse(storedNames));
    }
    if (storedWinner) {
      setPredeterminedWinner(storedWinner);
    }
  }, []);

  const calculateSegmentSize = useCallback(() => {
    return 360 / names.length;
  }, [names]);

  const calculateWinningRotation = useCallback(() => {
    const segmentSize = calculateSegmentSize();
    if (!predeterminedWinner || !names.includes(predeterminedWinner)) {
      // If no predetermined winner, choose a random segment
      const randomIndex = Math.floor(Math.random() * names.length);
      return 360 - (randomIndex * segmentSize) - POINTER_POSITION;
    }

    const winnerIndex = names.indexOf(predeterminedWinner);
    // Calculate the exact rotation to land on the predetermined winner
    return 360 - (winnerIndex * segmentSize) - POINTER_POSITION;
  }, [names, predeterminedWinner, calculateSegmentSize]);

  const spinWheel = useCallback(() => {
    if (!isSpinning && names.length > 0) {
      setIsSpinning(true);
      setWinner(null);
      
      const winningRotation = calculateWinningRotation();
      const totalRotation = 360 * 5 + winningRotation; // Spin at least 5 full rotations
      
      setRotation(prevRotation => prevRotation + totalRotation);
      
      setTimeout(() => {
        const winnerIndex = Math.floor((360 - (winningRotation + POINTER_POSITION)) / calculateSegmentSize()) % names.length;
        setWinner(names[winnerIndex]);
        setIsSpinning(false);
      }, 5000); // This should match the duration of the spin animation
    }
  }, [isSpinning, names, calculateWinningRotation, calculateSegmentSize]);

  const spinAnimation = useSpring({
    from: { transform: `rotate(0deg)` },
    to: { transform: `rotate(-${rotation}deg)` },
    config: { duration: 5000, easing: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) },
  });

  return (
    <WheelContainer>
      <Title>Spin the Wheel!</Title>
      <NavigationButton to="/">Edit Names</NavigationButton>
      <WheelWrapper>
        <Pointer style={{ transform: `rotate(${POINTER_POSITION}deg)` }} />
        <Wheel style={spinAnimation}>
          {names.map((name, index) => (
            <Segment 
              key={index} 
              color={colors[index % colors.length]} 
              rotate={index * calculateSegmentSize()}
              isWinner={!isSpinning && winner === name}
            >
              <SegmentText rotate={index * calculateSegmentSize()}>
                {name}
              </SegmentText>
            </Segment>
          ))}
        </Wheel>
      </WheelWrapper>
      <Button onClick={spinWheel} disabled={isSpinning || names.length === 0}>
      {isSpinning ? 'Spinning...' : 'SPIN & WIN!'}
      </Button>
      {winner && (
        <WinnerAnnouncement>
          <h2>Winner!</h2>
          <p>Congratulations to <strong>{winner}</strong>! 🎉</p>
        </WinnerAnnouncement>
      )}
    </WheelContainer>
  );
};

export default SpinningWheel;