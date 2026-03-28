import { useState, useEffect } from 'react';
import { Platform, PanResponder } from 'react-native';
import { InputState } from '@/types/game';

export default function useGameInput() {
  const [inputState, setInputState] = useState<InputState>({
    up: false,
    down: false,
    left: false,
    right: false,
    action: false,
  });

  // Reset action state after a short delay
  useEffect(() => {
    if (inputState.action) {
      const timer = setTimeout(() => {
        setInputState(prev => ({ ...prev, action: false }));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inputState.action]);

  // Reset directional inputs after a delay
  useEffect(() => {
    const resetDirections = () => {
      setInputState(prev => ({
        ...prev,
        up: false,
        down: false,
        left: false,
        right: false,
      }));
    };

    if (inputState.up || inputState.down || inputState.left || inputState.right) {
      const timer = setTimeout(resetDirections, 500);
      return () => clearTimeout(timer);
    }
  }, [inputState.up, inputState.down, inputState.left, inputState.right]);

  // Keyboard controls for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowUp':
            setInputState(prev => ({ ...prev, up: true }));
            break;
          case 'ArrowDown':
            setInputState(prev => ({ ...prev, down: true }));
            break;
          case 'ArrowLeft':
            setInputState(prev => ({ ...prev, left: true }));
            break;
          case 'ArrowRight':
            setInputState(prev => ({ ...prev, right: true }));
            break;
          case 'z':
          case 'Z':
            setInputState(prev => ({ ...prev, action: true }));
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  // Touch/swipe controls for mobile
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Short press for action
      const timer = setTimeout(() => {
        setInputState(prev => ({ ...prev, action: true }));
      }, 200);
      
      // Store the timer ID so we can clear it if the user starts moving
      (panResponder as any)._timerId = timer;
    },
    onPanResponderMove: (_, gestureState) => {
      // Clear the short press timer if the user starts moving
      if ((panResponder as any)._timerId) {
        clearTimeout((panResponder as any)._timerId);
        (panResponder as any)._timerId = null;
      }
      
      const { dx, dy } = gestureState;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only register a swipe if it's a significant movement
      if (distance > 30) {
        // Determine the direction of the swipe
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Clear previous directions
        setInputState(prev => ({
          ...prev,
          up: false,
          down: false,
          left: false,
          right: false,
        }));
        
        // Set the new direction based on the angle
        if (angle > -45 && angle < 45) {
          setInputState(prev => ({ ...prev, right: true }));
        } else if (angle >= 45 && angle < 135) {
          setInputState(prev => ({ ...prev, down: true }));
        } else if (angle >= 135 || angle < -135) {
          setInputState(prev => ({ ...prev, left: true }));
        } else if (angle >= -135 && angle < -45) {
          setInputState(prev => ({ ...prev, up: true }));
        }
      }
    },
    onPanResponderRelease: () => {
      // Clear the short press timer if it exists
      if ((panResponder as any)._timerId) {
        clearTimeout((panResponder as any)._timerId);
        (panResponder as any)._timerId = null;
      }
    },
  });

  return {
    inputState,
    panResponder,
  };
}