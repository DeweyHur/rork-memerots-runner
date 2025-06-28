import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import Colors from '@/constants/colors';
import { PERKS } from '@/constants/characters';
import { Shield, Zap, Copy } from 'lucide-react-native';

export default function GameHUD() {
  const { gameState, selectedCharacter } = useGameStore();
  const { score, health, activePerks, bossHealth, bossActive, stage } = gameState;

  const renderPerkIcon = (perkId: string) => {
    const perk = PERKS.find(p => p.id === perkId);
    if (!perk) return null;

    switch (perk.icon) {
      case 'shield':
        return <Shield size={16} color={perk.color} />;
      case 'zap':
        return <Zap size={16} color={perk.color} />;
      case 'copy':
        return <Copy size={16} color={perk.color} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <View style={styles.stageContainer}>
          <Text style={styles.stageLabel}>STAGE</Text>
          <Text style={styles.stageValue}>{stage + 1}</Text>
        </View>
      </View>

      <View style={styles.middleRow}>
        <View style={styles.healthContainer}>
          <Text style={styles.healthLabel}>HEALTH</Text>
          <View style={styles.healthBarContainer}>
            <View 
              style={[
                styles.healthBar, 
                { width: `${health}%` },
                health < 30 ? styles.lowHealth : health < 60 ? styles.mediumHealth : styles.highHealth
              ]} 
            />
          </View>
        </View>

        {bossActive && bossHealth !== undefined && (
          <View style={styles.bossHealthContainer}>
            <Text style={styles.bossHealthLabel}>BOSS</Text>
            <View style={styles.bossHealthBarContainer}>
              <View 
                style={[
                  styles.bossHealthBar, 
                  { width: `${bossHealth}%` }
                ]} 
              />
            </View>
          </View>
        )}
      </View>

      {activePerks.length > 0 && (
        <View style={styles.perksContainer}>
          {activePerks.map((perkId) => (
            <View key={perkId} style={styles.perkItem}>
              {renderPerkIcon(perkId)}
            </View>
          ))}
        </View>
      )}

      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{selectedCharacter?.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  scoreLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  scoreValue: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  stageContainer: {
    alignItems: 'flex-end',
  },
  stageLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  stageValue: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  middleRow: {
    marginBottom: 8,
  },
  healthContainer: {
    marginBottom: 4,
  },
  healthLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 2,
  },
  healthBarContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  healthBar: {
    height: '100%',
  },
  lowHealth: {
    backgroundColor: Colors.danger,
  },
  mediumHealth: {
    backgroundColor: Colors.warning,
  },
  highHealth: {
    backgroundColor: Colors.success,
  },
  bossHealthContainer: {
    marginTop: 8,
  },
  bossHealthLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 2,
  },
  bossHealthBarContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bossHealthBar: {
    height: '100%',
    backgroundColor: Colors.danger,
  },
  perksContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  perkItem: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  characterInfo: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  characterName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});