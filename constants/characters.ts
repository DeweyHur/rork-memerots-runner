import { Character } from "@/types/game";

export const CHARACTERS: Character[] = [
  {
    id: "tralalero",
    name: "Tralalero Tralala",
    description: "The mysterious sprite master",
    color: "#9B59B6",
    specialWeapon: "Sprite Magic",
    specialAbility: "Animation Mastery",
    image: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?q=80&w=200&auto=format&fit=crop",
    sprites: {
      walk: require('../assets/images/tra_walk.png'),
      jump: require('../assets/images/tra_jump.png'),
      fall: require('../assets/images/tra_fall.png'),
      attack: require('../assets/images/tra_attack.png'),
    },
    stats: {
      speed: 8,
      power: 7,
      defense: 5
    }
  },
  {
    id: "gabagool",
    name: "Gabagool",
    description: "Master of the pasta projectiles",
    color: "#FF6B6B",
    specialWeapon: "Pasta Cannon",
    specialAbility: "Mamma Mia Shield",
    image: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?q=80&w=200&auto=format&fit=crop",
    stats: {
      speed: 7,
      power: 8,
      defense: 5
    }
  },
  {
    id: "pizzaboy",
    name: "Pizza Boy",
    description: "Throws razor-sharp pizza slices",
    color: "#4ECDC4",
    specialWeapon: "Pizza Cutter",
    specialAbility: "Cheese Shield",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop",
    stats: {
      speed: 8,
      power: 6,
      defense: 6
    }
  },
  {
    id: "mozzarella",
    name: "Mozzarella",
    description: "Stretchy and deadly",
    color: "#FFE66D",
    specialWeapon: "Cheese Whip",
    specialAbility: "Dairy Dash",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=200&auto=format&fit=crop",
    stats: {
      speed: 9,
      power: 5,
      defense: 6
    }
  },
  {
    id: "espresso",
    name: "Espresso",
    description: "Hyper-caffeinated and dangerous",
    color: "#6B9EFF",
    specialWeapon: "Coffee Bean Blaster",
    specialAbility: "Caffeine Rush",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=200&auto=format&fit=crop",
    stats: {
      speed: 10,
      power: 7,
      defense: 3
    }
  }
];

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