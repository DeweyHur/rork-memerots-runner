// @ts-ignore: papaparse has no types
import Papa from 'papaparse';
import { Character } from "@/types/game";
import { Platform } from 'react-native';
import charactersJson from './characters-data.json';

// Default characters as fallback
const DEFAULT_CHARACTERS: Character[] = [
  {
    id: '0',
    name: '아레스1',
    description: 'The mighty warrior of Karion',
    color: '#FF6B6B',
    specialWeapon: 'Sword of Ares',
    specialAbility: 'Battle Fury',
    image: require('../assets/images/characters.png'),
    sprites: {
      down: [],
      up: [],
      left: [],
      right: [],
      hit: [],
      dead: []
    },
    stats: { speed: 9, power: 5, defense: 38 }
  },
  {
    id: '1',
    name: '에레인',
    description: 'The swift archer of Severt',
    color: '#4ECDC4',
    specialWeapon: 'Precision Bow',
    specialAbility: 'Quick Shot',
    image: require('../assets/images/characters.png'),
    sprites: {
      down: [],
      up: [],
      left: [],
      right: [],
      hit: [],
      dead: []
    },
    stats: { speed: 8, power: 10, defense: 40 }
  }
];

// Loads and parses the JSON, returning the character array
export async function loadCharacters(): Promise<Character[]> {
  try {
    console.log('🔄 Loading characters from JSON...');
    // Use the imported JSON directly
    const spriteJson = charactersJson;
    console.log('📄 JSON structure:', Object.keys(spriteJson));
    
    const spriteFrames = spriteJson.textures?.[0]?.frames || [];
    console.log('🎬 Total sprite frames found:', spriteFrames?.length || 0);
    
    const framesByChar: Record<string, any[]> = {};
    for (const frame of spriteFrames) {
      const match = frame.filename.match(/^out\/(\d+)\/(\w+)_([0-9]+)/);
      if (!match) continue;
      const [_, charIdx, action, frameIdx] = match;
      if (!framesByChar[charIdx]) framesByChar[charIdx] = [];
      framesByChar[charIdx].push({ action, frameIdx: Number(frameIdx), ...frame });
    }
    
    console.log('👥 Characters found in JSON:', Object.keys(framesByChar));
    console.log('📊 Frames per character:', Object.fromEntries(
      Object.entries(framesByChar).map(([char, frames]) => [char, frames.length])
    ));
    // Use 아레스1 (0), 에레인 (1), and enemy characters (149-168)
    const playerIds = ['0', '1'];
    const enemyIds = ['149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '161', '163', '164', '166', '167', '168'];
    const allIds = [...playerIds, ...enemyIds];
    
    const characters: Character[] = allIds.map((id) => {
      const isPlayer = playerIds.includes(id);
      const isEnemy = enemyIds.includes(id);
      
      // Default name and stats
      let name = `Character ${id}`;
      let stats = { speed: 5, power: 3, defense: 20 };
      
      if (isPlayer) {
        name = id === '0' ? '아레스1' : '에레인';
        stats = id === '0'
          ? { speed: 9, power: 5, defense: 38 }
          : { speed: 8, power: 10, defense: 40 };
      } else if (isEnemy) {
        name = `Enemy ${id}`;
        stats = { speed: 3, power: 2, defense: 15 };
      }
      
      const sprites: any = {};
      const actions = ['down', 'up', 'left', 'right', 'hit', 'dead'];
      actions.forEach(action => {
        const frames = (framesByChar[id] || []).filter(f => f.action === action);
        sprites[action] = frames;
      });
      
      const characterData = {
        0: {
          color: '#FF6B6B',
          description: 'The mighty warrior of Karion',
          specialWeapon: 'Sword of Ares',
          specialAbility: 'Battle Fury'
        },
        1: {
          color: '#4ECDC4',
          description: 'The swift archer of Severt',
          specialWeapon: 'Precision Bow',
          specialAbility: 'Quick Shot'
        }
      };
      
      const charData = characterData[id as '0' | '1'] || {
        color: '#666666',
        description: isEnemy ? 'A dangerous enemy' : 'A mysterious character',
        specialWeapon: 'Basic Attack',
        specialAbility: 'Standard Move'
      };
      
      return {
        id,
        name,
        description: charData.description,
        color: charData.color,
        specialWeapon: charData.specialWeapon,
        specialAbility: charData.specialAbility,
        image: require('../assets/images/characters.png'),
        sprites,
        stats,
      };
    });
    return characters;
  } catch (error) {
    console.warn('❌ Error loading characters from JSON:', error);
    return DEFAULT_CHARACTERS;
  }
}

// NOTE: This file now exports an async loader. Update all imports to use loadCharacters() and await it at app startup.

export const BOSSES = [
  {
    id: "bigcheese",
    name: "Big Cheese",
    description: "The godfather of dairy",
    health: 100,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=200&auto=format&fit=crop",
    attacks: ["Cheese Bomb", "Mozzarella Missile", "Parmesan Punch"]
  },
  {
    id: "pastadonna",
    name: "Pasta Donna",
    description: "She'll make you an offer you can't refuse",
    health: 120,
    image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?q=80&w=200&auto=format&fit=crop",
    attacks: ["Spaghetti Lasso", "Ravioli Rain", "Linguine Lash"]
  },
  {
    id: "baristaboss",
    name: "Barista Boss",
    description: "Extremely bitter and highly pressurized",
    health: 150,
    image: "https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?q=80&w=200&auto=format&fit=crop",
    attacks: ["Espresso Shot", "Steam Blast", "Bean Barrage"]
  }
];

export const PERKS = [
  {
    id: "rapidfire",
    name: "Rapid Fire",
    description: "Increases fire rate",
    color: "#FF6B6B",
    icon: "zap"
  },
  {
    id: "doubleshoot",
    name: "Double Shot",
    description: "Fires two projectiles at once",
    color: "#4ECDC4",
    icon: "copy"
  },
  {
    id: "shield",
    name: "Shield",
    description: "Temporary invincibility",
    color: "#FFE66D",
    icon: "shield"
  },
  {
    id: "powerup",
    name: "Power Up",
    description: "Increases damage",
    color: "#6B9EFF",
    icon: "zap"
  }
];

export const STAGES = [
  {
    id: "kitchen",
    name: "The Kitchen",
    description: "Watch out for flying meatballs!",
    background: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1000&auto=format&fit=crop",
    boss: "bigcheese"
  },
  {
    id: "restaurant",
    name: "The Restaurant",
    description: "Dodge the waiters and flying plates!",
    background: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
    boss: "pastadonna"
  },
  {
    id: "cafe",
    name: "The Cafe",
    description: "Beware of the steam and hot coffee!",
    background: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=1000&auto=format&fit=crop",
    boss: "baristaboss"
  }
];