import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BOSSES } from '@/constants/characters';
import Colors from '@/constants/colors';

interface BossProps {
  stage: number;
}

export default function Boss({ stage }: BossProps) {
  const boss = BOSSES[stage % BOSSES.length];
  
  if (!boss) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {/* Eyes */}
        <View style={styles.eyesContainer}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        
        {/* Mouth */}
        <View style={styles.mouth} />
        
        {/* Name */}
        <Text style={styles.name}>{boss.name}</Text>
      </View>
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
    width: '90%',
    height: '90%',
    borderRadius: 20,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.text,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 10,
  },
  eye: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: Colors.text,
  },
  mouth: {
    width: '50%',
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text,
  },
  name: {
    position: 'absolute',
    bottom: 10,
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
});