import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { playerName, setPlayerName, resetGame } = useGameStore();
  
  useEffect(() => {
    // Reset game state when returning to home screen
    resetGame();
  }, []);
  
  const handleStart = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/character-select');
  };
  
  const handleLeaderboard = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/leaderboard');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#121212', '#2a2a2a']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>BRAIN ROT</Text>
          <Text style={styles.subtitle}>RUNNER</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Your Name:</Text>
          <TextInput
            style={styles.input}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Player"
            placeholderTextColor="#666"
            maxLength={15}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="START GAME"
            onPress={handleStart}
            variant="primary"
            size="large"
            fullWidth
          />
          
          <Button
            title="LEADERBOARD"
            onPress={handleLeaderboard}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.leaderboardButton}
          />
        </View>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Play:</Text>
          <Text style={styles.instructionsText}>
            • {Platform.OS === 'web' ? 'Arrow Keys' : 'Swipe'} to move
          </Text>
          <Text style={styles.instructionsText}>
            • {Platform.OS === 'web' ? 'Z Key' : 'Tap'} to activate perks
          </Text>
          <Text style={styles.instructionsText}>
            • Defeat enemies and bosses
          </Text>
          <Text style={styles.instructionsText}>
            • Collect perks to power up
          </Text>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: -10,
  },
  imageContainer: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    color: Colors.text,
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  leaderboardButton: {
    marginTop: 12,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    borderRadius: 8,
  },
  instructionsTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionsText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
});