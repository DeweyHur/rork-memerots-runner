import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Character } from '@/types/game';
import Colors from '@/constants/colors';

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