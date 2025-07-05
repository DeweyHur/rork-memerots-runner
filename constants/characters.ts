// @ts-ignore: papaparse has no types
import Papa from 'papaparse';
import { Character } from "@/types/game";
import { Platform } from 'react-native';

// Default characters as fallback
const DEFAULT_CHARACTERS: Character[] = [
  {
    id: '1',
    name: 'Tra',
    description: 'The main protagonist',
    color: '#FF6B6B',
    specialWeapon: 'Rapid Fire',
    specialAbility: 'Double Jump',
    image: '/assets/images/characters.png',
    sprites: {
      walk: [],
      jump: [],
      fall: [],
      attack: []
    },
    stats: { speed: 8, power: 6, defense: 5 }
  },
  {
    id: '2',
    name: 'Chef',
    description: 'Master of the kitchen',
    color: '#4ECDC4',
    specialWeapon: 'Flying Pan',
    specialAbility: 'Food Shield',
    image: '/assets/images/characters.png',
    sprites: {
      walk: [],
      jump: [],
      fall: [],
      attack: []
    },
    stats: { speed: 5, power: 8, defense: 7 }
  },
  {
    id: '3',
    name: 'Barista',
    description: 'Coffee-powered runner',
    color: '#6B9EFF',
    specialWeapon: 'Steam Blast',
    specialAbility: 'Caffeine Boost',
    image: '/assets/images/characters.png',
    sprites: {
      walk: [],
      jump: [],
      fall: [],
      attack: []
    },
    stats: { speed: 7, power: 5, defense: 6 }
  },
  {
    id: '4',
    name: 'Waiter',
    description: 'Agile and quick',
    color: '#FFE66D',
    specialWeapon: 'Plate Throw',
    specialAbility: 'Quick Step',
    image: '/assets/images/characters.png',
    sprites: {
      walk: [],
      jump: [],
      fall: [],
      attack: []
    },
    stats: { speed: 9, power: 4, defense: 4 }
  }
];

// Loads and parses the CSV and JSON, returning the character array
export async function loadCharacters(): Promise<Character[]> {
  console.log('🔄 Starting character loading...');
  try {
    let csvText: string;
    let spriteJson: any;

    if (Platform.OS === 'web') {
      console.log('🌐 Loading characters for web platform...');
      // Load CSV
      csvText = await fetch('/assets/images/characters.csv').then(res => res.text());
      console.log('✅ CSV loaded successfully');
      // Load JSON
      spriteJson = await fetch('/assets/images/characters.json').then(res => res.json());
      console.log('✅ JSON loaded successfully');
    } else {
      console.log('📱 Loading characters for native platform...');
      // For native platforms, we'll need to handle this differently
      // For now, let's use a fallback approach
      try {
        // Try to fetch from the local assets
        csvText = await fetch('/assets/images/characters.csv').then(res => res.text());
        spriteJson = await fetch('/assets/images/characters.json').then(res => res.json());
        console.log('✅ Native assets loaded successfully');
      } catch (error) {
        console.warn('⚠️ Could not load character assets:', error);
        console.log('🔄 Using default characters as fallback');
        // Return default characters as fallback
        return DEFAULT_CHARACTERS;
      }
    }

    const { data: rows } = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    console.log(`📊 Parsed ${rows.length} character rows from CSV`);

    // Build a map from spriteJson frames
    const spriteFrames = spriteJson.frames || spriteJson; // handle both array or object
    const framesByChar: Record<string, any[]> = {};
    for (const frame of spriteFrames) {
      const match = frame.filename.match(/^out\/(\d+)\/(\w+)_([0-9]+)/);
      if (!match) continue;
      const [_, charIdx, action, frameIdx] = match;
      if (!framesByChar[charIdx]) framesByChar[charIdx] = [];
      framesByChar[charIdx].push({ action, frameIdx: Number(frameIdx), ...frame });
    }

    // Group frames by action and sort by frameIdx
    const getActionFrames = (charIdx: string, action: string) => {
      return (framesByChar[charIdx] || [])
        .filter(f => f.action === action)
        .sort((a, b) => a.frameIdx - b.frameIdx);
    };

    // Map CSV rows to Character objects
    const characters: Character[] = rows.map((row: any, i: number) => {
      const id = row.no || String(i);
      const name = row.name;
      // Map stats as needed (customize as per your Character type)
      const stats = {
        speed: Number(row.hr) || 5,
        power: Number(row.ad) || 5,
        defense: Number(row.df) || 5,
      };
      // Map sprite actions
      const actions = ['down', 'up', 'left', 'right', 'attack', 'jump', 'fall', 'hit', 'dead'];
      const sprites: any = {};
      actions.forEach(action => {
        const frames = getActionFrames(id, action);
        if (frames.length) sprites[action] = frames;
      });
      return {
        id,
        name,
        description: '', // Optionally add
        color: '#fff', // Optionally map from team or other field
        specialWeapon: '',
        specialAbility: '',
        image: '/assets/images/characters.png', // Use path string instead of require
        sprites,
        stats,
      };
    });
    console.log(`🎮 Successfully loaded ${characters.length} characters from CSV/JSON`);
    return characters;
  } catch (error) {
    console.warn('❌ Error loading characters from CSV/JSON:', error);
    console.log('🔄 Using default characters as fallback');
    // Return default characters as fallback
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