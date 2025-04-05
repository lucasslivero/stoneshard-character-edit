interface ISkillsDataMap {
  skillsAllDataList: unknown[];
  skillsPanelDataList: unknown[];
}

export interface IBodyParts {
  head: number;
  tors: number;
  rhand: number;
  lhand: number;
  rlegs: number;
  legs: number;
}

export interface ICharacterDataMap {
  Strength15: number;
  Sanity: number;
  Morale: number;
  bMP_Restoration: number;
  enemyTypeList: string[];
  lock_skills: unknown[];
  Perception25: number;
  Intoxication: number;
  statsTimeLevel: number;
  'Drink_And_Be_Merry!': string[];
  Agility15: number;
  Vitality25: number;
  bCRTD: number;
  LVL: number;
  CorpseSprite: string;
  sexKey: string;
  That_Belongs_In_A_Museum: number;
  WIL: number;
  verren_ring: number;
  TombRaiderTombs: number;
  lock_items: unknown[];
  lock_spells: unknown[];
  playerClass: string;
  Strength20: number;
  playerGridX: number;
  nameKey: string;
  buffs: unknown[];
  Agility20: number;
  lock_turn: unknown[];
  Books_Read: string[];
  bmax_hp: number;
  Thirsty: number;
  lock_attack: unknown[];
  Head: string;
  SP: number;
  AGL: number;
  Sleep_Scale: number;
  bVSN: number;
  Willpower25: number;
  usedFoodTypes: string[];
  isDuplicatedtLocation: number;
  TombRaiderGraves: number;
  checkpointLocation: string;
  groundLevel: number;
  Body: IBodyParts;
  localX: number;
  bSavvy: number;
  Fatigue: number;
  Master_Tracker: string[];
  Hunger: number;
  'Fetch_This!': number;
  raceKey: string;
  STR: number;
  contract_list: unknown[];
  psychic_chance: number[];
  bHp: number;
  'Theory_&_Praxis': string[];
  OldXP: number;
  Vitality20: number;
  classKey: string;
  "Trapmaker's_Art": number;
  inversion: unknown[];
  Perception20: number;
  PRC: number;
  image_xscale: number;
  usedDrugsTypes: unknown[];
  XP: number;
  Willpower15: number;
  AP: number;
  locationTitleKey: string;
  Vitality: number;
  Immunity: number;
  MP: number;
  Ups_and_Downs: string[];
  Strength25: number;
  bCRT: number;
  avatar: string;
  BodySprite: string;
  Perception15: number;
  npcTypeList: string[];
  bMp: number;
  Backfire_Damage: number;
  playerGridY: number;
  Received_XP: number;
  Agility25: number;
  Vitality15: number;
  bEVS: number;
  collectedHerbsTypes: string[];
  localY: number;
  lock_regen: unknown[];
  Willpower20: number;
  psychic_CD: number[];
  Pain: number;
  specialItemsPool: string[];
  bFMB: number;
  lock_mana_regen: unknown[];
  usedAlcoTypes: unknown[];
  HP: number;
}

interface ITimeDataMap {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  months: number;
}

type IInventoryItem<T> = [
  string, // Item name or identifier
  T, // Main item properties
  number, // Unidentified purpose field
  number, // Unidentified purpose field
  number, // Unidentified purpose field
  number, // Charge or durability
  number, // Cursed quality or special attribute
  boolean, // Boolean flag
  boolean, // Another boolean flag
  string, // Optional metadata or description
];

interface IItemDetails {
  Material: string;
  max_charge: number;
  idName: string;
  Duration: number;
  is_cursed: number;
  MaxDuration: number;
  i_index: number;
  Main: (string | number)[]; // Array of main attributes (e.g., stats)
  identified: number;
  charge: number;
  Effects_Duration: number;
  Stack?: number; // Optional, for stackable items
  lootList?: IInventoryItem<IItemDetails>[]; // Optional, nested inventory items (e.g., moneybag contents)
  is_execute?: number; // Optional, for execution or special condition
  Curse?: unknown[]; // Optional, for items with curses
  Colour?: number; // Optional, for items with colors
  DEF?: number; // Optional, for defensive stats
  Suffix?: string; // Optional, suffix or item placement
  Physical_Resistance?: number; // Optional, for resistance attributes
  Knockback_Resistance?: number; // Optional, for resistance attributes
  Bleeding_Resistance?: number; // Optional, for resistance attributes
  Frost_Resistance?: number; // Optional, for resistance attributes
  CRTD?: number; // Optional, critical damage
  FMB?: number; // Optional, flat modifier bonus
  EVS?: number; // Optional, evasion stats
  MP_Restoration?: number; // Optional, for magic point restoration
  Miscast_Chance?: number; // Optional, for miscast chance
  Armor_Piercing?: number; // Optional, for weapons
  Skills_Energy_Cost?: number; // Optional, for energy cost of abilities
  Slashing_Damage?: number; // Optional, damage value for slashing attacks
  DMG?: number; // Optional, general damage value
  Bodypart_Damage?: number; // Optional, specific body part damage value
  Range?: number; // Optional, for ranged or melee attributes
  Health_Restoration?: number; // Optional, for healing attributes
  Nature_Resistance?: number; // Optional, for nature resistance
  rarity?: string; // Optional, rarity of the item
  tags?: string; // Optional, tags for categorization
  quality?: number; // Optional, quality level
  Metatype?: string; // Optional, general type (e.g., "Armor", "Weapon")
  cursedQuality?: number; // Optional, penalty due to curse
  Armor_Type?: string; // Optional, type of armor
  DamageType?: string; // Optional, type of damage (e.g., "Slashing_Damage")
}

export interface ICharacterSaveFile {
  characterDataMap: ICharacterDataMap;
  skillsDataMap: ISkillsDataMap;
  inventoryDataList: IInventoryItem<IItemDetails>[];
  timeDataMap: ITimeDataMap;
}
