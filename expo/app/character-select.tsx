import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import CharacterCard from '@/components/CharacterCard';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function CharacterSelectScreen() {
  const router = useRouter();
  const { selectCharacter, startGame, characters, charactersLoading, loadCharactersAsync } = useGameStore();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎯 Character select screen mounted');
    console.log('📊 Current characters:', characters.length);
    console.log('⏳ Characters loading:', charactersLoading);
    
    // Always load characters to ensure we get the proper ones with sprites
    console.log('🔄 Loading characters...');
    loadCharactersAsync();
  }, []);

  const handleSelectCharacter = (character: any) => {
    console.log('👤 Character selected:', character.name);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCharacterId(character.id);
    selectCharacter(character);
  };

  const handleStartGame = () => {
    console.log('🚀 Starting game with character:', selectedCharacterId);
    if (!selectedCharacterId) {
      console.warn('⚠️ No character selected!');
      return;
    }

    // Find the selected character
    const selectedCharacter = characters.find(c => c.id === selectedCharacterId);
    if (!selectedCharacter) {
      console.error('❌ Selected character not found!');
      return;
    }

    // Validate sprite loading
    console.log('🔍 Validating sprite loading for character:', selectedCharacter.name);
    
    if (!selectedCharacter.sprites) {
      console.error('❌ Character has no sprites object');
      Alert.alert(
        'Sprite Loading Error',
        `${selectedCharacter.name} has no sprite data loaded. Please try again.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Check each required action has at least one frame
    const requiredActions = ['left', 'right', 'up', 'down', 'hit', 'dead'] as const;
    const missingActions: string[] = [];
    const spriteStatus: Record<string, number> = {};

    for (const action of requiredActions) {
      const frames = selectedCharacter.sprites[action];
      const frameCount = frames && Array.isArray(frames) ? frames.length : 0;
      spriteStatus[action] = frameCount;
      
      console.log(`🎬 ${action}: ${frameCount} frames`);
      
      if (frameCount === 0) {
        missingActions.push(action);
      }
    }

    console.log('📊 Sprite validation summary:', spriteStatus);

    if (missingActions.length > 0) {
      console.error('❌ Missing sprite frames for actions:', missingActions);
      Alert.alert(
        'Sprite Loading Error',
        `${selectedCharacter.name} is missing sprite frames for: ${missingActions.join(', ')}\n\nPlease try reloading the game.`,
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('✅ Sprite validation passed! All actions have frames loaded.');

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

      {charactersLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={characters}
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
      )}

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