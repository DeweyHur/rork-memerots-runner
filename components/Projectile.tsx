import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Character } from '@/types/game';
import Colors from '@/constants/colors';

interface ProjectileProps {
  powered: boolean;
  character: Character | null;
}

export default function Projectile({ powered, character }: ProjectileProps) {
  const color = character?.color || Colors.primary;
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: color },
        powered && styles.powered,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.text,
  },
  powered: {
    borderWidth: 2,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
});