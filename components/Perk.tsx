import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Shield, Zap, Copy } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface PerkProps {
  type: string;
  color: string;
}

export default function Perk({ type, color }: PerkProps) {
  const renderIcon = () => {
    switch (type) {
      case 'shield':
        return <Shield size={20} color={Colors.text} />;
      case 'rapidfire':
        return <Zap size={20} color={Colors.text} />;
      case 'doubleshoot':
        return <Copy size={20} color={Colors.text} />;
      case 'powerup':
        return <Zap size={20} color={Colors.text} />;
      default:
        return <Zap size={20} color={Colors.text} />;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.text,
  },
});