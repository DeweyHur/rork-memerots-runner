import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import LeaderboardTable from '@/components/LeaderboardTable';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { leaderboard, characters, charactersLoading, loadCharactersAsync } = useGameStore();
  const [filter, setFilter] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (!characters.length && !charactersLoading) {
      loadCharactersAsync();
    }
  }, []);
  
  const handleFilterChange = (characterId: string | undefined) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFilter(characterId);
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
        <Text style={styles.title}>LEADERBOARD</Text>
        <Text style={styles.subtitle}>Top scores from all players</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === undefined && styles.filterButtonActive,
          ]}
          onPress={() => handleFilterChange(undefined)}
        >
          <Text style={[
            styles.filterText,
            filter === undefined && styles.filterTextActive,
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {characters.map((character) => (
          <TouchableOpacity
            key={character.id}
            style={[
              styles.filterButton,
              filter === character.id && styles.filterButtonActive,
              { borderColor: character.color },
            ]}
            onPress={() => handleFilterChange(character.id)}
          >
            <Text style={[
              styles.filterText,
              filter === character.id && styles.filterTextActive,
              { color: filter === character.id ? Colors.text : character.color },
            ]}>
              {character.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.tableContainer}>
        <LeaderboardTable entries={leaderboard} filter={filter} />
      </View>
      
      <View style={styles.footer}>
        <Button
          title="BACK TO HOME"
          onPress={handleBack}
          variant="primary"
          size="medium"
          fullWidth
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
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 16,
    justifyContent: 'center',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#555',
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: '#aaa',
    fontSize: 12,
  },
  filterTextActive: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
});