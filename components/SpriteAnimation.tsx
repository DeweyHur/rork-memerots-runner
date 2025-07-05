import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface SpriteAnimationProps {
  spriteSheet?: any; // For traditional sprite sheets
  spriteFrames?: any[]; // For frame data from JSON
  imageSource?: any; // The source image for sprite frames
  columns?: number;
  rows?: number;
  frameRate: number;
  isPlaying: boolean;
  style?: any;
}

export default function SpriteAnimation({ 
  spriteSheet, 
  spriteFrames,
  imageSource,
  columns = 4, 
  rows = 1, 
  frameRate, 
  isPlaying, 
  style 
}: SpriteAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationTimer, setAnimationTimer] = useState(0);
  
  // If we have sprite frames, use their length, otherwise use traditional sprite sheet
  const totalFrames = spriteFrames ? spriteFrames.length : (columns * rows);
  
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
  
  // If we have sprite frames, render them using the frame data
  if (spriteFrames && spriteFrames.length > 0) {
    const currentFrameData = spriteFrames[currentFrame];
    if (!currentFrameData) {
      return null;
    }
    const { frame } = currentFrameData;
    const scale = 4;
    // The sprite sheet is 2048x2048
    return (
      <View
        style={[
          {
            width: frame.w * scale,
            height: frame.h * scale,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        <Image
          source={imageSource || require('../assets/images/characters.png')}
          style={{
            width: 2048 * scale,
            height: 2048 * scale,
            transform: [
              { translateX: -frame.x * scale },
              { translateY: -frame.y * scale },
            ],
          }}
          resizeMode="cover"
          onError={error => console.log('❌ Image loading error:', error)}
          onLoad={() => console.log('✅ Image loaded successfully')}
        />
      </View>
    );
  }
  
  // Traditional sprite sheet rendering
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
    overflow: 'visible', // Changed from 'hidden' to 'visible'
  },
  spriteSheetContainer: {
    width: '100%',
    height: '100%',
    overflow: 'visible', // Changed from 'hidden' to 'visible'
  },
  spriteSheet: {
    width: '100%',
    height: '100%',
  },
}); 