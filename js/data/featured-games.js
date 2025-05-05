/**
 * This file contains data for featured games on the Steam Clone website
 * Images sourced from Steam for educational purposes
 */

const featuredGames = [
  {
    id: 1,
    title: "V Rising - Eternal Dominance Pack",
    price: 260000,
    discountPercent: 0,
    categories: ["Survival", "Open World", "Base Building", "Multiplayer"],
    releaseDate: "2025-04-28",
    developer: "Stunlock Studios",
    publisher: "Stunlock Studios",
    headerImage: "assets/images/games/v-rising.jpg",
    screenshots: [
      "assets/images/games/v-rising-1.jpg",
      "assets/images/games/v-rising-2.jpg",
      "assets/images/games/v-rising-3.jpg"
    ],
    description: "V Rising - Eternal Dominance Pack includes the base game and additional content to enhance your vampire survival experience. Build your castle, hunt for blood, and rise to power in a world designed to eliminate your kind."
  },
  {
    id: 2,
    title: "Magic Rune Stone",
    price: 142000,
    discountPercent: 15,
    categories: ["Action", "Action Roguelike", "Roguelike", "2D"],
    releaseDate: "2025-04-25",
    developer: "MagicStone Games",
    publisher: "MagicStone Games",
    headerImage: "assets/images/games/magic-rune-stone.jpg",
    screenshots: [
      "assets/images/games/magic-rune-stone-1.jpg",
      "assets/images/games/magic-rune-stone-2.jpg",
      "assets/images/games/magic-rune-stone-3.jpg"
    ],
    description: "Magic Rune Stone is an action roguelike game featuring magical runes, intense combat, and procedurally generated levels. Collect powerful runes, customize your build, and defeat challenging enemies."
  },
  {
    id: 3,
    title: "World of Goo 2",
    price: 385000,
    discountPercent: 15,
    categories: ["Physics", "Puzzle", "Building", "Casual"],
    releaseDate: "2025-04-25",
    developer: "2D Boy",
    publisher: "2D Boy",
    headerImage: "assets/images/games/world-of-goo-2.jpg",
    screenshots: [
      "assets/images/games/world-of-goo-2-1.jpg",
      "assets/images/games/world-of-goo-2-2.jpg",
      "assets/images/games/world-of-goo-2-3.jpg"
    ],
    description: "The long-awaited sequel to the award-winning physics-based puzzle game. Build bridges, towers, and structures using balls of goo in this charming and challenging puzzle adventure."
  },
  {
    id: 4,
    title: "Monster Prom 4: Monster Con",
    price: 205000,
    discountPercent: 10,
    categories: ["Visual Novel", "LGBTQ+", "Comedy", "Multiplayer"],
    releaseDate: "2025-04-24",
    developer: "Beautiful Glitch",
    publisher: "Beautiful Glitch",
    headerImage: "assets/images/games/monster-prom-4.jpg",
    screenshots: [
      "assets/images/games/monster-prom-4-1.jpg",
      "assets/images/games/monster-prom-4-2.jpg",
      "assets/images/games/monster-prom-4-3.jpg"
    ],
    description: "Monster Prom 4: Monster Con is a competitive dating sim set at a monster convention. Play solo or with friends as you try to woo your favorite monster date in this comedic visual novel adventure."
  },
  {
    id: 5,
    title: "Tempest Rising",
    price: 540000,
    discountPercent: 0,
    categories: ["RTS", "Strategy", "Base Building", "Singleplayer"],
    releaseDate: "2025-04-21",
    developer: "Slipgate Ironworks",
    publisher: "3D Realms",
    headerImage: "assets/images/games/tempest-rising.jpg",
    screenshots: [
      "assets/images/games/tempest-rising-1.jpg",
      "assets/images/games/tempest-rising-2.jpg",
      "assets/images/games/tempest-rising-3.jpg"
    ],
    description: "Tempest Rising is a classic real-time strategy game inspired by the golden age of the genre. Build your base, manage resources, and command armies in intense tactical battles."
  },
  {
    id: 6,
    title: "SpellRogue",
    price: 260000,
    discountPercent: 30,
    categories: ["Deckbuilding", "Dice", "Roguelike Deckbuilder", "Card Battler"],
    releaseDate: "2025-04-24",
    developer: "SpellRogue Team",
    publisher: "Devolver Digital",
    headerImage: "assets/images/games/spellrogue.jpg",
    screenshots: [
      "assets/images/games/spellrogue-1.jpg",
      "assets/images/games/spellrogue-2.jpg",
      "assets/images/games/spellrogue-3.jpg"
    ],
    description: "SpellRogue combines deckbuilding and dice mechanics in a unique roguelike experience. Build your spell deck, roll for powerful combinations, and defeat challenging enemies in procedurally generated dungeons."
  },
  {
    id: 7,
    title: "BOKURA: planet",
    price: 77500,
    discountPercent: 10,
    categories: ["Action", "Adventure", "Casual", "Action-Adventure"],
    releaseDate: "2025-04-24",
    developer: "BOKURA Studios",
    publisher: "BOKURA Studios",
    headerImage: "assets/images/games/bokura-planet.jpg",
    screenshots: [
      "assets/images/games/bokura-planet-1.jpg",
      "assets/images/games/bokura-planet-2.jpg",
      "assets/images/games/bokura-planet-3.jpg"
    ],
    description: "BOKURA: planet is a casual action-adventure game set on a mysterious planet. Explore vibrant environments, solve puzzles, and uncover the secrets of this alien world."
  },
  {
    id: 8,
    title: "Clair Obscur: Expedition 33",
    price: 770000,
    discountPercent: 10,
    categories: ["Turn-Based Combat", "Story Rich", "Fantasy", "Exploration"],
    releaseDate: "2025-04-24",
    developer: "Clair Obscur Games",
    publisher: "Clair Obscur Games",
    headerImage: "assets/images/games/clair-obscur.jpg",
    screenshots: [
      "assets/images/games/clair-obscur-1.jpg",
      "assets/images/games/clair-obscur-2.jpg",
      "assets/images/games/clair-obscur-3.jpg"
    ],
    description: "Clair Obscur: Expedition 33 is a turn-based tactical RPG with a rich narrative. Lead your expedition through dangerous territories, engage in strategic combat, and make choices that impact the story."
  },
  {
    id: 9,
    title: "FATAL FURY: City of the Wolves",
    price: 1526500,
    discountPercent: 0,
    categories: ["Action", "2D Fighter", "2D", "PvP"],
    releaseDate: "2025-04-24",
    developer: "SNK",
    publisher: "SNK",
    headerImage: "assets/images/games/fatal-fury.jpg",
    screenshots: [
      "assets/images/games/fatal-fury-1.jpg",
      "assets/images/games/fatal-fury-2.jpg",
      "assets/images/games/fatal-fury-3.jpg"
    ],
    description: "FATAL FURY: City of the Wolves is the latest entry in the legendary fighting game series. Master various fighting styles, execute powerful special moves, and compete against players around the world."
  },
  {
    id: 10,
    title: "The Hundred Line -Last Defense Academy-",
    price: 1000000,
    discountPercent: 0,
    categories: ["Multiple Endings", "Adventure", "Story Rich", "Anime"],
    releaseDate: "2025-04-23",
    developer: "Hundred Line Studios",
    publisher: "Hundred Line Studios",
    headerImage: "assets/images/games/hundred-line.jpg",
    screenshots: [
      "assets/images/games/hundred-line-1.jpg",
      "assets/images/games/hundred-line-2.jpg",
      "assets/images/games/hundred-line-3.jpg"
    ],
    description: "The Hundred Line -Last Defense Academy- is a story-rich adventure game with multiple endings. Attend a prestigious academy, build relationships with your fellow students, and make choices that determine your fate."
  },
  {
    id: 11,
    title: "Dolls Nest",
    price: 260000,
    discountPercent: 0,
    categories: ["Action", "Mechs", "Robots", "Souls-like"],
    releaseDate: "2025-04-23",
    developer: "Dolls Nest Team",
    publisher: "Dolls Nest Team",
    headerImage: "assets/images/games/dolls-nest.jpg",
    screenshots: [
      "assets/images/games/dolls-nest-1.jpg",
      "assets/images/games/dolls-nest-2.jpg",
      "assets/images/games/dolls-nest-3.jpg"
    ],
    description: "Dolls Nest is a challenging souls-like action game featuring mechs and robots. Pilot powerful mechanical dolls, upgrade your systems, and face formidable enemies in a dark sci-fi world."
  }
];

// Export the data for use in other modules
export default featuredGames;