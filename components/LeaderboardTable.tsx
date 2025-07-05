import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LeaderboardEntry } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import Colors from '@/constants/colors';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  filter?: string;
}

export default function LeaderboardTable({ entries, filter }: LeaderboardTableProps) {
  const { characters, charactersLoading } = useGameStore();

  if (charactersLoading) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const character = characters.find(c => c.id === item.characterId);
          return (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.playerName}</Text>
              <Text style={styles.cell}>{character ? character.name : item.characterId}</Text>
              <Text style={styles.cell}>{item.score}</Text>
              <Text style={styles.cell}>{item.distance}</Text>
            </View>
          );
        }}
        ListHeaderComponent={() => (
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Player</Text>
            <Text style={styles.headerCell}>Character</Text>
            <Text style={styles.headerCell}>Score</Text>
            <Text style={styles.headerCell}>Distance</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: 8,
  },
  headerCell: {
    flex: 1,
    color: Colors.text,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    padding: 8,
  },
  cell: {
    flex: 1,
    color: Colors.text,
  },
});