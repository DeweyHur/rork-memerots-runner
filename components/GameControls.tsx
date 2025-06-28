import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface GameControlsProps {
  onPressUp: () => void;
  onPressDown: () => void;
  onPressLeft: () => void;
  onPressRight: () => void;
  onPressAction: () => void;
}

export default function GameControls({
  onPressUp,
  onPressDown,
  onPressLeft,
  onPressRight,
  onPressAction,
}: GameControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.directionalContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.upButton]} 
          onPress={onPressUp}
          activeOpacity={0.7}
        >
          <ArrowUp size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.middleRow}>
          <TouchableOpacity 
            style={[styles.button, styles.leftButton]} 
            onPress={onPressLeft}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <View style={styles.centerSpace} />
          
          <TouchableOpacity 
            style={[styles.button, styles.rightButton]} 
            onPress={onPressRight}
            activeOpacity={0.7}
          >
            <ArrowRight size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, styles.downButton]} 
          onPress={onPressDown}
          activeOpacity={0.7}
        >
          <ArrowDown size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.actionButton]} 
        onPress={onPressAction}
        activeOpacity={0.7}
      >
        <Zap size={24} color={Colors.text} />
        <Text style={styles.actionText}>Z</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  directionalContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  centerSpace: {
    width: 50,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  upButton: {
    marginBottom: 10,
  },
  downButton: {
    marginTop: 10,
  },
  leftButton: {},
  rightButton: {},
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  actionText: {
    color: Colors.text,
    fontSize: 10,
    marginTop: -5,
  },
});