import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import GameEngine from '@/components/GameEngine';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function GameScreen() {
  const router = useRouter();
  const { gameState, resetGame, advanceStage } = useGameStore();
  
  // Handle back button on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        // If game is over or victory, go back to home
        if (gameState.status === 'gameOver' || gameState.status === 'victory') {
          router.replace('/');
          return true;
        }
        
        // Otherwise, show confirmation dialog
        // For simplicity, we'll just go back
        router.replace('/');
        return true;
      });
      
      return () => backHandler.remove();
    }
  }, [gameState.status]);
  
  const handleRetry = () => {
    resetGame();
  };
  
  const handleContinue = () => {
    advanceStage();
  };
  
  const handleBackToHome = () => {
    router.replace('/');
  };
  
  const handleViewLeaderboard = () => {
    router.replace('/leaderboard');
  };
  
  // Game over overlay
  const renderGameOver = () => (
    <View style={styles.overlay}>
      <Text style={styles.overlayTitle}>GAME OVER</Text>
      <Text style={styles.overlayScore}>Score: {gameState.score}</Text>
      <Text style={styles.overlayDistance}>Distance: {Math.floor(gameState.distance)}m</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="RETRY"
          onPress={handleRetry}
          variant="primary"
          size="large"
          style={styles.button}
        />
        
        <Button
          title="LEADERBOARD"
          onPress={handleViewLeaderboard}
          variant="outline"
          size="medium"
          style={styles.button}
        />
        
        <Button
          title="HOME"
          onPress={handleBackToHome}
          variant="secondary"
          size="medium"
          style={styles.button}
        />
      </View>
    </View>
  );
  
  // Victory overlay
  const renderVictory = () => (
    <View style={styles.overlay}>
      <Text style={styles.overlayTitle}>VICTORY!</Text>
      <Text style={styles.overlayScore}>Score: {gameState.score}</Text>
      <Text style={styles.overlayDistance}>Stage {gameState.stage + 1} Completed!</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="CONTINUE"
          onPress={handleContinue}
          variant="primary"
          size="large"
          style={styles.button}
        />
        
        <Button
          title="HOME"
          onPress={handleBackToHome}
          variant="secondary"
          size="medium"
          style={styles.button}
        />
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <GameEngine />
      
      {gameState.status === 'gameOver' && renderGameOver()}
      {gameState.status === 'victory' && renderVictory()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  overlayScore: {
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 10,
  },
  overlayDistance: {
    fontSize: 18,
    color: Colors.secondary,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    marginBottom: 12,
  },
});