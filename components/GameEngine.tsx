import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import useGameInput from '@/hooks/useGameInput';
import GameHUD from './GameHUD';
import GameControls from './GameControls';
import Player from './Player';
import Enemy from './Enemy';
import Projectile from './Projectile';
import Perk from './Perk';
import Boss from './Boss';
import { PERKS } from '@/constants/characters';
import { Enemy as EnemyType, Projectile as ProjectileType } from '@/types/game';

const { width, height } = Dimensions.get('window');

export default function GameEngine() {
  const { gameState, selectedCharacter, updateScore, updateHealth, updateDistance, addPerk, activateBoss, updateBossHealth, advanceStage } = useGameStore();
  const { inputState, panResponder } = useGameInput();
  
  // Game state
  const [playerPosition, setPlayerPosition] = useState({ x: width / 4, y: height / 2 });
  const [playerState, setPlayerState] = useState({ jumping: false, crouching: false, dashing: false, avoiding: false });
  const [enemies, setEnemies] = useState<EnemyType[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileType[]>([]);
  const [perks, setPerks] = useState<any[]>([]);
  const [boss, setBoss] = useState<any>(null);
  
  // Animation values
  const backgroundPosition = useRef(new Animated.Value(0)).current;
  const playerY = useRef(new Animated.Value(height / 2)).current;
  
  // Game loop
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const frameCount = useRef(0);
  const lastFireTime = useRef(0);
  const gameSpeed = useRef(5);
  
  // Initialize game
  useEffect(() => {
    if (gameState.status === 'playing') {
      startGameLoop();
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, [gameState.status]);
  
  // Handle input
  useEffect(() => {
    if (gameState.status !== 'playing') return;
    
    if (inputState.up && !playerState.jumping) {
      jump();
    }
    
    if (inputState.down && !playerState.crouching) {
      crouch();
    }
    
    if (inputState.right && !playerState.dashing) {
      dash();
    }
    
    if (inputState.left && !playerState.avoiding) {
      avoid();
    }
    
    if (inputState.action) {
      activatePerk();
    }
  }, [inputState, gameState.status]);
  
  // Start game loop
  const startGameLoop = () => {
    if (gameLoopRef.current) return;
    
    gameLoopRef.current = setInterval(() => {
      frameCount.current += 1;
      
      // Update game state
      updateGameState();
      
      // Spawn enemies
      if (frameCount.current % 60 === 0 && !gameState.bossActive) {
        spawnEnemy();
      }
      
      // Spawn perks
      if (frameCount.current % 180 === 0 && !gameState.bossActive) {
        spawnPerk();
      }
      
      // Activate boss after certain distance
      if (gameState.distance > 1000 && !gameState.bossActive && !boss) {
        activateBoss();
        spawnBoss();
      }
      
      // Auto-fire projectiles
      if (Date.now() - lastFireTime.current > 500) {
        fireProjectile();
        lastFireTime.current = Date.now();
      }
      
      // Increase game speed over time
      if (frameCount.current % 300 === 0) {
        gameSpeed.current = Math.min(gameSpeed.current + 0.5, 15);
      }
      
      // Update score and distance
      updateScore(1);
      updateDistance(gameSpeed.current);
      
    }, 1000 / 60); // 60 FPS
  };
  
  // Update game state
  const updateGameState = () => {
    // Move background
    const currentBgPosition = backgroundPosition.getValue();
    backgroundPosition.setValue((currentBgPosition + gameSpeed.current) % width);
    
    // Update enemies
    setEnemies(prev => {
      return prev
        .map(enemy => ({
          ...enemy,
          x: enemy.x - gameSpeed.current - enemy.speed,
        }))
        .filter(enemy => enemy.x > -100);
    });
    
    // Update projectiles
    setProjectiles(prev => {
      return prev
        .map(projectile => ({
          ...projectile,
          x: projectile.x + projectile.speed,
        }))
        .filter(projectile => projectile.x < width + 100);
    });
    
    // Update perks
    setPerks(prev => {
      return prev
        .map(perk => ({
          ...perk,
          x: perk.x - gameSpeed.current,
        }))
        .filter(perk => perk.x > -100);
    });
    
    // Update boss
    if (boss) {
      setBoss((prev: any) => {
        if (!prev) return null;
        
        // Boss movement pattern
        let newX = prev.x;
        let newY = prev.y;
        
        // Move back and forth
        if (frameCount.current % 120 < 60) {
          newX = Math.max(width * 0.6, prev.x - 1);
        } else {
          newX = Math.min(width * 0.8, prev.x + 1);
        }
        
        // Move up and down
        if (frameCount.current % 180 < 90) {
          newY = Math.max(height * 0.2, prev.y - 1);
        } else {
          newY = Math.min(height * 0.8, prev.y + 1);
        }
        
        // Boss attacks
        if (frameCount.current % 90 === 0) {
          spawnEnemyFromBoss();
        }
        
        return {
          ...prev,
          x: newX,
          y: newY,
        };
      });
    }
    
    // Check collisions
    checkCollisions();
  };
  
  // Player actions
  const jump = () => {
    setPlayerState(prev => ({ ...prev, jumping: true }));
    
    Animated.sequence([
      Animated.timing(playerY, {
        toValue: height / 3,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(playerY, {
        toValue: height / 2,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setPlayerState(prev => ({ ...prev, jumping: false }));
    });
  };
  
  const crouch = () => {
    setPlayerState(prev => ({ ...prev, crouching: true }));
    
    setTimeout(() => {
      setPlayerState(prev => ({ ...prev, crouching: false }));
    }, 500);
  };
  
  const dash = () => {
    setPlayerState(prev => ({ ...prev, dashing: true }));
    
    setPlayerPosition(prev => ({
      ...prev,
      x: prev.x + 50,
    }));
    
    setTimeout(() => {
      setPlayerPosition(prev => ({
        ...prev,
        x: width / 4,
      }));
      setPlayerState(prev => ({ ...prev, dashing: false }));
    }, 500);
  };
  
  const avoid = () => {
    setPlayerState(prev => ({ ...prev, avoiding: true }));
    
    setPlayerPosition(prev => ({
      ...prev,
      x: prev.x - 50,
    }));
    
    setTimeout(() => {
      setPlayerPosition(prev => ({
        ...prev,
        x: width / 4,
      }));
      setPlayerState(prev => ({ ...prev, avoiding: false }));
    }, 500);
  };
  
  // Game mechanics
  const spawnEnemy = () => {
    const enemyTypes = ['small', 'medium', 'large'];
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    const enemy = {
      id: `enemy-${Date.now()}-${Math.random()}`,
      type,
      x: width + 100,
      y: Math.random() * (height * 0.6) + (height * 0.2),
      width: type === 'small' ? 30 : type === 'medium' ? 50 : 70,
      height: type === 'small' ? 30 : type === 'medium' ? 50 : 70,
      health: type === 'small' ? 1 : type === 'medium' ? 2 : 3,
      speed: type === 'small' ? 3 : type === 'medium' ? 2 : 1,
    };
    
    setEnemies(prev => [...prev, enemy]);
  };
  
  const spawnEnemyFromBoss = () => {
    if (!boss) return;
    
    const enemy = {
      id: `boss-enemy-${Date.now()}-${Math.random()}`,
      type: 'boss-projectile',
      x: boss.x - 50,
      y: boss.y,
      width: 40,
      height: 40,
      health: 1,
      speed: 5,
    };
    
    setEnemies(prev => [...prev, enemy]);
  };
  
  const spawnPerk = () => {
    const availablePerks = PERKS;
    const perk = availablePerks[Math.floor(Math.random() * availablePerks.length)];
    
    const perkObj = {
      id: `perk-${Date.now()}-${Math.random()}`,
      type: perk.id,
      x: width + 100,
      y: Math.random() * (height * 0.6) + (height * 0.2),
      width: 40,
      height: 40,
      color: perk.color,
    };
    
    setPerks(prev => [...prev, perkObj]);
  };
  
  const spawnBoss = () => {
    const bossObj = {
      id: `boss-${gameState.stage}`,
      x: width * 0.7,
      y: height / 2,
      width: 120,
      height: 120,
      health: 100,
    };
    
    setBoss(bossObj);
  };
  
  const fireProjectile = () => {
    // Basic projectile
    let projectileConfig = {
      speed: 10,
      damage: 1,
      width: 20,
      height: 10,
    };
    
    // Apply active perks
    if (gameState.activePerks.includes('rapidfire')) {
      lastFireTime.current -= 200; // Reduce cooldown
    }
    
    if (gameState.activePerks.includes('powerup')) {
      projectileConfig.damage = 2;
      projectileConfig.width = 30;
    }
    
    const currentPlayerY = playerY.getValue();
    
    const projectile = {
      id: `projectile-${Date.now()}-${Math.random()}`,
      x: playerPosition.x + 50,
      y: currentPlayerY,
      ...projectileConfig,
    };
    
    setProjectiles(prev => [...prev, projectile]);
    
    // Double shot perk
    if (gameState.activePerks.includes('doubleshoot')) {
      const projectile2 = {
        id: `projectile-${Date.now()}-${Math.random()}-2`,
        x: playerPosition.x + 50,
        y: currentPlayerY - 30,
        ...projectileConfig,
      };
      
      setProjectiles(prev => [...prev, projectile2]);
    }
  };
  
  const activatePerk = () => {
    const currentPlayerY = playerY.getValue();
    
    // Find the closest perk
    const closestPerk = perks.reduce((closest, perk) => {
      const distance = Math.sqrt(
        Math.pow(perk.x - playerPosition.x, 2) + 
        Math.pow(perk.y - currentPlayerY, 2)
      );
      
      if (!closest || distance < closest.distance) {
        return { perk, distance };
      }
      
      return closest;
    }, null as { perk: any, distance: number } | null);
    
    if (closestPerk && closestPerk.distance < 100) {
      // Activate the perk
      addPerk(closestPerk.perk.type);
      
      // Remove the perk from the game
      setPerks(prev => prev.filter(p => p.id !== closestPerk.perk.id));
    }
  };
  
  const checkCollisions = () => {
    const currentPlayerY = playerY.getValue();
    
    // Player hitbox
    const playerHitbox = {
      x: playerPosition.x,
      y: currentPlayerY,
      width: 60,
      height: playerState.crouching ? 40 : 60,
    };
    
    // Check enemy collisions
    enemies.forEach(enemy => {
      // Enemy hitbox
      const enemyHitbox = {
        x: enemy.x,
        y: enemy.y,
        width: enemy.width,
        height: enemy.height,
      };
      
      // Check if player collides with enemy
      if (
        playerHitbox.x < enemyHitbox.x + enemyHitbox.width &&
        playerHitbox.x + playerHitbox.width > enemyHitbox.x &&
        playerHitbox.y < enemyHitbox.y + enemyHitbox.height &&
        playerHitbox.y + playerHitbox.height > enemyHitbox.y
      ) {
        // Player takes damage if not shielded
        if (!gameState.activePerks.includes('shield')) {
          updateHealth(-10);
        }
        
        // Remove the enemy
        setEnemies(prev => prev.filter(e => e.id !== enemy.id));
      }
      
      // Check if projectiles hit enemy
      projectiles.forEach(projectile => {
        // Projectile hitbox
        const projectileHitbox = {
          x: projectile.x,
          y: projectile.y,
          width: projectile.width,
          height: projectile.height,
        };
        
        // Check if projectile collides with enemy
        if (
          projectileHitbox.x < enemyHitbox.x + enemyHitbox.width &&
          projectileHitbox.x + projectileHitbox.width > enemyHitbox.x &&
          projectileHitbox.y < enemyHitbox.y + enemyHitbox.height &&
          projectileHitbox.y + projectileHitbox.height > enemyHitbox.y
        ) {
          // Remove the projectile
          setProjectiles(prev => prev.filter(p => p.id !== projectile.id));
          
          // Reduce enemy health
          setEnemies(prev => 
            prev.map(e => {
              if (e.id === enemy.id) {
                return {
                  ...e,
                  health: e.health - projectile.damage,
                };
              }
              return e;
            }).filter(e => e.health > 0)
          );
          
          // Add score
          updateScore(10);
        }
      });
    });
    
    // Check boss collisions
    if (boss) {
      // Boss hitbox
      const bossHitbox = {
        x: boss.x,
        y: boss.y,
        width: boss.width,
        height: boss.height,
      };
      
      // Check if projectiles hit boss
      projectiles.forEach(projectile => {
        // Projectile hitbox
        const projectileHitbox = {
          x: projectile.x,
          y: projectile.y,
          width: projectile.width,
          height: projectile.height,
        };
        
        // Check if projectile collides with boss
        if (
          projectileHitbox.x < bossHitbox.x + bossHitbox.width &&
          projectileHitbox.x + projectileHitbox.width > bossHitbox.x &&
          projectileHitbox.y < bossHitbox.y + bossHitbox.height &&
          projectileHitbox.y + projectileHitbox.height > bossHitbox.y
        ) {
          // Remove the projectile
          setProjectiles(prev => prev.filter(p => p.id !== projectile.id));
          
          // Reduce boss health
          updateBossHealth(-projectile.damage);
          
          // Add score
          updateScore(20);
          
          // Check if boss is defeated
          if ((gameState.bossHealth || 0) <= 0) {
            setBoss(null);
            advanceStage();
          }
        }
      });
    }
  };
  
  // Render game elements
  return (
    <View 
      style={styles.container}
      {...(Platform.OS !== 'web' ? panResponder.panHandlers : {})}
    >
      {/* Background */}
      <Animated.View
        style={[
          styles.background,
          {
            transform: [{ translateX: Animated.multiply(backgroundPosition, -1) }],
          },
        ]}
      >
        <View style={styles.ground} />
      </Animated.View>
      
      {/* Player */}
      <Animated.View
        style={[
          styles.player,
          {
            left: playerPosition.x,
            top: playerY,
            transform: [
              { scaleY: playerState.crouching ? 0.7 : 1 },
              { translateX: playerState.dashing ? 20 : playerState.avoiding ? -20 : 0 },
            ],
          },
        ]}
      >
        <Player 
          character={selectedCharacter} 
          state={playerState}
          shielded={gameState.activePerks.includes('shield')}
        />
      </Animated.View>
      
      {/* Enemies */}
      {enemies.map(enemy => (
        <View
          key={enemy.id}
          style={[
            styles.enemy,
            {
              left: enemy.x,
              top: enemy.y,
              width: enemy.width,
              height: enemy.height,
            },
          ]}
        >
          <Enemy type={enemy.type} />
        </View>
      ))}
      
      {/* Projectiles */}
      {projectiles.map(projectile => (
        <View
          key={projectile.id}
          style={[
            styles.projectile,
            {
              left: projectile.x,
              top: projectile.y,
              width: projectile.width,
              height: projectile.height,
            },
          ]}
        >
          <Projectile 
            powered={gameState.activePerks.includes('powerup')}
            character={selectedCharacter}
          />
        </View>
      ))}
      
      {/* Perks */}
      {perks.map(perk => (
        <View
          key={perk.id}
          style={[
            styles.perk,
            {
              left: perk.x,
              top: perk.y,
            },
          ]}
        >
          <Perk type={perk.type} color={perk.color} />
        </View>
      ))}
      
      {/* Boss */}
      {boss && (
        <View
          style={[
            styles.boss,
            {
              left: boss.x,
              top: boss.y,
              width: boss.width,
              height: boss.height,
            },
          ]}
        >
          <Boss stage={gameState.stage} />
        </View>
      )}
      
      {/* HUD */}
      <GameHUD />
      
      {/* Controls (only on mobile) */}
      {Platform.OS !== 'web' && (
        <GameControls
          onPressUp={jump}
          onPressDown={crouch}
          onPressLeft={avoid}
          onPressRight={dash}
          onPressAction={activatePerk}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    width: width * 2,
    height,
    backgroundColor: '#121212',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#333',
  },
  player: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  enemy: {
    position: 'absolute',
  },
  projectile: {
    position: 'absolute',
  },
  perk: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  boss: {
    position: 'absolute',
  },
});