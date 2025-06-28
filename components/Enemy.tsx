import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface EnemyProps {
  type: string;
}

export default function Enemy({ type }: EnemyProps) {
  const getEnemyStyle = () => {
    switch (type) {
      case 'small':
        return {
          backgroundColor: Colors.danger,
          borderRadius: 15,
        };
      case 'medium':
        return {
          backgroundColor: Colors.warning,
          borderRadius: 10,
        };
      case 'large':
        return {
          backgroundColor: Colors.info,
          borderRadius: 5,
        };
      case 'boss-projectile':
        return {
          backgroundColor: Colors.primary,
          borderRadius: 20,
        };
      default:
        return {
          backgroundColor: Colors.danger,
          borderRadius: 15,
        };
    }
  };
  
  return (
    <View style={[styles.container, getEnemyStyle()]}>
      {/* Eyes */}
      <View style={styles.eyesContainer}>
        <View style={styles.eye} />
        <View style={styles.eye} />
      </View>
      
      {/* Mouth */}
      <View style={styles.mouth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.text,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginBottom: 2,
  },
  eye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.text,
  },
  mouth: {
    width: '40%',
    height: 3,
    borderRadius: 1,
    backgroundColor: Colors.text,
  },
});