import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { CHARACTERS } from '@/constants/characters';
import CharacterCard from '@/components/CharacterCard';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function CharacterSelectScreen() {
  const router = useRouter();
  const { selectCharacter, startGame } = useGameStore();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  
  const handleSelectCharacter = (character: any) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCharacterId(character.id);
    selectCharacter(character);
  };
  
  const handleStartGame = () => {
    if (!selectedCharacterId) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    startGame();
    router.push('/game');
  };
  
  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#121212', '#2a2a2a']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>SELECT YOUR CHARACTER</Text>
        <Text style={styles.subtitle}>Each character has unique abilities</Text>
      </View>
      
      <FlatList
        data={CHARACTERS}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            selected={selectedCharacterId === item.id}
            onSelect={handleSelectCharacter}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        <Button
          title="BACK"
          onPress={handleBack}
          variant="outline"
          size="medium"
          style={styles.backButton}
        />
        
        <Button
          title="START GAME"
          onPress={handleStartGame}
          variant="primary"
          size="large"
          disabled={!selectedCharacterId}
          style={styles.startButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 4,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  backButton: {
    width: '30%',
  },
  startButton: {
    width: '65%',
  },
});