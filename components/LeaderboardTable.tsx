import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LeaderboardEntry } from '@/types/game';
import { CHARACTERS } from '@/constants/characters';
import Colors from '@/constants/colors';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  filter?: string;
}

export default function LeaderboardTable({ entries, filter }: LeaderboardTableProps) {
  const filteredEntries = filter 
    ? entries.filter(entry => entry.characterId === filter)
    : entries;
  
  const renderItem = ({ item, index }: { item: LeaderboardEntry, index: number }) => {
    const character = CHARACTERS.find(c => c.id === item.characterId);
    const date = new Date(item.date).toLocaleDateString();
    
    return (
      <View style={[
        styles.row, 
        index % 2 === 0 ? styles.evenRow : styles.oddRow,
        index === 0 && styles.topRow,
      ]}>
        <Text style={[styles.cell, styles.rankCell]}>#{index + 1}</Text>
        <Text style={[styles.cell, styles.nameCell]}>{item.playerName}</Text>
        <Text style={[styles.cell, styles.characterCell, { color: character?.color || Colors.text }]}>
          {character?.name || 'Unknown'}
        </Text>
        <Text style={[styles.cell, styles.scoreCell]}>{item.score}</Text>
        <Text style={[styles.cell, styles.dateCell]}>{date}</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerCell, styles.rankCell]}>Rank</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>Player</Text>
        <Text style={[styles.headerCell, styles.characterCell]}>Character</Text>
        <Text style={[styles.headerCell, styles.scoreCell]}>Score</Text>
        <Text style={[styles.headerCell, styles.dateCell]}>Date</Text>
      </View>
      
      {filteredEntries.length > 0 ? (
        <FlatList
          data={filteredEntries}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No scores yet. Be the first!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  list: {
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  evenRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  oddRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  topRow: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  cell: {
    color: Colors.text,
    fontSize: 14,
  },
  rankCell: {
    width: '10%',
    fontWeight: 'bold',
  },
  nameCell: {
    width: '25%',
  },
  characterCell: {
    width: '25%',
  },
  scoreCell: {
    width: '20%',
    textAlign: 'right',
  },
  dateCell: {
    width: '20%',
    textAlign: 'right',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
  },
});