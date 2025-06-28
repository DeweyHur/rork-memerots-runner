export interface Character {
  id: string;
  name: string;
  description: string;
  color: string;
  specialWeapon: string;
  specialAbility: string;
  image: string;
  stats: {
    speed: number;
    power: number;
    defense: number;
  };
}

export interface Boss {
  id: string;
  name: string;
  description: string;
  health: number;
  image: string;
  attacks: string[];
}

export interface Perk {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  background: string;
  boss: string;
}

export interface Enemy {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  speed: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  damage: number;
}

export interface GameState {
  status: 'ready' | 'playing' | 'paused' | 'gameOver' | 'victory';
  score: number;
  distance: number;
  stage: number;
  health: number;
  activePerks: string[];
  enemies: Enemy[];
  projectiles: Projectile[];
  bossHealth?: number;
  bossActive: boolean;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  characterId: string;
  score: number;
  distance: number;
  date: string;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  action: boolean;
}