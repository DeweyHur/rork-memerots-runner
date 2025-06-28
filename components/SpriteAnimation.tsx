import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface SpriteAnimationProps {
  spriteSheet: any;
  columns: number;
  rows: number;
  frameRate: number;
  isPlaying: boolean;
  style?: any;
}

export default function SpriteAnimation({ 
  spriteSheet, 
  columns, 
  rows, 
  frameRate, 
  isPlaying, 
  style 
}: SpriteAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationTimer, setAnimationTimer] = useState(0);
  
  const totalFrames = columns * rows;
  
  // Animation frame counter for sprite cycling
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setAnimationTimer(prev => prev + 1);
    }, frameRate);
    
    return () => clearInterval(interval);
  }, [isPlaying, frameRate]);
  
  // Update current frame based on animation timer
  useEffect(() => {
    setCurrentFrame(animationTimer % totalFrames);
  }, [animationTimer, totalFrames]);
  
  // Calculate which row and column the current frame is in
  const currentRow = Math.floor(currentFrame / columns);
  const currentCol = currentFrame % columns;
  
  // Calculate the position of the current frame in the sprite sheet
  const frameWidth = 100 / columns; // Percentage width of each frame
  const frameHeight = 100 / rows;   // Percentage height of each frame
  const frameX = currentCol * frameWidth;
  const frameY = currentRow * frameHeight;
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.spriteSheetContainer}>
        <Image
          source={spriteSheet}
          style={[
            styles.spriteSheet,
            {
              width: `${columns * 100}%`,
              height: `${rows * 100}%`,
              transform: [
                { translateX: `${-frameX}%` },
                { translateY: `${-frameY}%` },
              ],
            },
          ]}
          resizeMode="stretch"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  spriteSheetContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  spriteSheet: {
    width: '100%',
    height: '100%',
  },
}); 