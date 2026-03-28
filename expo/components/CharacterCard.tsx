import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Character } from '@/types/game';
import Colors from '@/constants/colors';

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  onSelect: (character: Character) => void;
}

export default function CharacterCard({ character, selected, onSelect }: CharacterCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: character.color },
        selected && styles.selected,
      ]}
      onPress={() => onSelect(character)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: character.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.description}>{character.description}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Speed</Text>
            <View style={styles.statBarContainer}>
              <View 
                style={[
                  styles.statBar, 
                  { width: `${character.stats.speed * 10}%`, backgroundColor: character.color }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Power</Text>
            <View style={styles.statBarContainer}>
              <View 
                style={[
                  styles.statBar, 
                  { width: `${character.stats.power * 10}%`, backgroundColor: character.color }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Defense</Text>
            <View style={styles.statBarContainer}>
              <View 
                style={[
                  styles.statBar, 
                  { width: `${character.stats.defense * 10}%`, backgroundColor: character.color }
                ]} 
              />
            </View>
          </View>
        </View>
        
        <View style={styles.specialsContainer}>
          <Text style={styles.specialLabel}>
            <Text style={{ fontWeight: 'bold' }}>Weapon:</Text> {character.specialWeapon}
          </Text>
          <Text style={styles.specialLabel}>
            <Text style={{ fontWeight: 'bold' }}>Ability:</Text> {character.specialAbility}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  selected: {
    borderWidth: 3,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  imageContainer: {
    height: 120,
    width: '100%',
    backgroundColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statItem: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 2,
  },
  statBarContainer: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
  },
  specialsContainer: {
    marginTop: 8,
  },
  specialLabel: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
});