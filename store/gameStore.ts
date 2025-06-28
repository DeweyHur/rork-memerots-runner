import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, GameState, LeaderboardEntry } from '@/types/game';
import { CHARACTERS, STAGES } from '@/constants/characters';

interface GameStore {
  // Game state
  gameState: GameState;
  selectedCharacter: Character | null;
  leaderboard: LeaderboardEntry[];
  playerName: string;
  
  // Actions
  selectCharacter: (character: Character) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  updateScore: (points: number) => void;
  updateDistance: (distance: number) => void;
  updateHealth: (health: number) => void;
  addPerk: (perkId: string) => void;
  removePerk: (perkId: string) => void;
  addEnemy: (enemy: any) => void;
  removeEnemy: (enemyId: string) => void;
  addProjectile: (projectile: any) => void;
  removeProjectile: (projectileId: string) => void;
  activateBoss: () => void;
  updateBossHealth: (health: number) => void;
  addToLeaderboard: (entry: Omit<LeaderboardEntry, 'id' | 'date'>) => void;
  setPlayerName: (name: string) => void;
  advanceStage: () => void;
}

const initialGameState: GameState = {
  status: 'ready',
  score: 0,
  distance: 0,
  stage: 0,
  health: 100,
  activePerks: [],
  enemies: [],
  projectiles: [],
  bossActive: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: { ...initialGameState },
      selectedCharacter: null,
      leaderboard: [],
      playerName: 'Player',

      selectCharacter: (character) => set({ selectedCharacter: character }),
      
      startGame: () => set((state) => ({ 
        gameState: { 
          ...initialGameState,
          status: 'playing' 
        } 
      })),
      
      pauseGame: () => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          status: 'paused' 
        } 
      })),
      
      resumeGame: () => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          status: 'playing' 
        } 
      })),
      
      endGame: () => {
        const { gameState, selectedCharacter, playerName } = get();
        
        if (gameState.status === 'playing') {
          // Add to leaderboard
          get().addToLeaderboard({
            playerName,
            characterId: selectedCharacter?.id || 'unknown',
            score: gameState.score,
            distance: gameState.distance,
          });
          
          set((state) => ({ 
            gameState: { 
              ...state.gameState, 
              status: 'gameOver' 
            } 
          }));
        }
      },
      
      resetGame: () => set({ gameState: { ...initialGameState } }),
      
      updateScore: (points) => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          score: state.gameState.score + points 
        } 
      })),
      
      updateDistance: (distance) => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          distance: state.gameState.distance + distance 
        } 
      })),
      
      updateHealth: (health) => {
        set((state) => {
          const newHealth = state.gameState.health + health;
          
          // If health drops to 0 or below, end the game
          if (newHealth <= 0) {
            get().endGame();
            return { 
              gameState: { 
                ...state.gameState, 
                health: 0 
              } 
            };
          }
          
          return { 
            gameState: { 
              ...state.gameState, 
              health: newHealth 
            } 
          };
        });
      },
      
      addPerk: (perkId) => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          activePerks: [...state.gameState.activePerks, perkId] 
        } 
      })),
      
      removePerk: (perkId) => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          activePerks: state.gameState.activePerks.filter(id => id !== perkId) 
        } 
      })),
      
      addEnemy: (enemy) => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          enemies: [...state.gameState.enemies, enemy] 
        } 
      })),
      
      removeEnemy: (enemyId) => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          enemies: state.gameState.enemies.filter(enemy => enemy.id !== enemyId) 
        } 
      })),
      
      addProjectile: (projectile) => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          projectiles: [...state.gameState.projectiles, projectile] 
        } 
      })),
      
      removeProjectile: (projectileId) => set((state) => ({ 
        gameState: { 
          ...state.gameState, 
          projectiles: state.gameState.projectiles.filter(projectile => projectile.id !== projectileId) 
        } 
      })),
      
      activateBoss: () => set((state) => {
        const currentStage = state.gameState.stage;
        const boss = STAGES[currentStage]?.boss;
        const bossData = boss ? { bossHealth: 100, bossActive: true } : {};
        
        return { 
          gameState: { 
            ...state.gameState, 
            ...bossData
          } 
        };
      }),
      
      updateBossHealth: (health) => set((state) => {
        const newHealth = (state.gameState.bossHealth || 0) + health;
        
        // If boss health drops to 0 or below, mark victory
        if (newHealth <= 0) {
          return { 
            gameState: { 
              ...state.gameState, 
              bossHealth: 0,
              bossActive: false,
              status: 'victory'
            } 
          };
        }
        
        return { 
          gameState: { 
            ...state.gameState, 
            bossHealth: newHealth 
          } 
        };
      }),
      
      addToLeaderboard: (entry) => set((state) => {
        const newEntry: LeaderboardEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          ...entry
        };
        
        const newLeaderboard = [...state.leaderboard, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Keep only top 10
          
        return { leaderboard: newLeaderboard };
      }),
      
      setPlayerName: (name) => set({ playerName: name }),
      
      advanceStage: () => set((state) => {
        const nextStage = state.gameState.stage + 1;
        
        // If there are no more stages, end the game with victory
        if (nextStage >= STAGES.length) {
          return { 
            gameState: { 
              ...initialGameState,
              score: state.gameState.score,
              status: 'victory' 
            } 
          };
        }
        
        return { 
          gameState: { 
            ...initialGameState,
            score: state.gameState.score, // Keep the score
            stage: nextStage,
            status: 'playing'
          } 
        };
      }),
    }),
    {
      name: 'brain-rot-runner-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        leaderboard: state.leaderboard,
        playerName: state.playerName
      }),
    }
  )
);