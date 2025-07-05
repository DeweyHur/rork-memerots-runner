import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Character } from '@/types/game';
import Colors from '@/constants/colors';
import SpriteAnimation from './SpriteAnimation';

interface PlayerProps {
  character: Character | null;
  state: {
    jumping: boolean;
    crouching: boolean;
    dashing: boolean;
    avoiding: boolean;
  };
  shielded: boolean;
}

export default function Player({ character, state, shielded }: PlayerProps) {
  if (!character) return null;
  
  // If character has sprites, use them
  if (character.sprites) {
    let spriteFrames;
    let isPlaying = true;
    
    // Determine which sprite to use based on state
    if (state.jumping) {
      spriteFrames = character.sprites.up; // Use up sprites for jumping
    } else if (state.crouching) {
      spriteFrames = character.sprites.left; // Use left sprites for crouching
    } else if (state.dashing || state.avoiding) {
      spriteFrames = character.sprites.right; // Use right sprites for dashing/avoiding
    } else {
      spriteFrames = character.sprites.down; // Use down sprites for walking
    }
    
    console.log('🎮 Player sprite selection:', {
      character: character.name,
      state,
      selectedAction: state.jumping ? 'up' : state.crouching ? 'left' : state.dashing || state.avoiding ? 'right' : 'down',
      spriteFramesCount: spriteFrames ? spriteFrames.length : 0,
      hasImage: !!character.image
    });
    
    // Only render if we have sprite frames
    if (spriteFrames && spriteFrames.length > 0) {
      return (
        <View style={styles.container}>
          <View style={styles.spriteContainer}>
            <SpriteAnimation
              spriteFrames={spriteFrames}
              imageSource={character.image}
              frameRate={150}
              isPlaying={isPlaying}
              style={{
                transform: [
                  { scaleY: state.crouching ? 0.7 : 1 },
                  { scaleX: state.avoiding ? -1 : 1 }, // Flip horizontally when avoiding
                ],
              }}
            />
          </View>
          
          {/* Shield effect */}
          {shielded && (
            <View style={styles.shield} />
          )}
        </View>
      );
    } else {
      console.log('❌ Player: No sprite frames for action, using fallback');
    }
  } else {
    console.log('❌ Player: No sprites object found');
  }
  
  // Fallback to original geometric design if no sprites
  return (
    <View style={styles.container}>
      {/* Character body */}
      <View 
        style={[
          styles.body, 
          { backgroundColor: character.color },
          state.crouching && styles.crouching,
          state.dashing && styles.dashing,
          state.avoiding && styles.avoiding,
        ]}
      >
        {/* Eyes */}
        <View style={styles.eyesContainer}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        
        {/* Mouth */}
        <View style={styles.mouth} />
      </View>
      
      {/* Shield effect */}
      {shielded && (
        <View style={styles.shield} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spriteContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible', // Changed from 'hidden' to 'visible'
  },
  body: {
    width: '80%',
    height: '80%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.text,
  },
  crouching: {
    height: '60%',
    borderRadius: 20,
  },
  dashing: {
    transform: [{ scaleX: 1.2 }],
  },
  avoiding: {
    transform: [{ rotate: '-10deg' }],
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginBottom: 5,
  },
  eye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.text,
  },
  mouth: {
    width: '40%',
    height: 5,
    borderRadius: 2,
    backgroundColor: Colors.text,
  },
  shield: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.accent,
    opacity: 0.7,
  },
});