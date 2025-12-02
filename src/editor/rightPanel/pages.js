export const BOOKS = [
  { label: "Tiles",    ref: "TILES" },
  { label: "Entities", ref: "ENTITIES" },
  { label: "Audio",    ref: "AUDIO" },
  { label: "Logic",    ref: "LOGIC" },
  { label: "Files",    ref: "FILES" },
];

export const PAGES = {
  TILES: [
    { label: "world_tileset", page: "WORLD_TILESET" },
    { label: "coin",          page: "COIN" },
    { label: "fruits",        page: "FRUITS" },
  ],

  AUDIO: [
    { label: "Assets",  page: "AUDIO_ASSETS" },
    { label: "Pattern", page: "AUDIO_PATTERN" },
  ],

  LOGIC: [
    { label: "Triggers", page: "LOGIC_TRIGGERS" },
    { label: "Events",   page: "LOGIC_EVENTS" },
  ],

  FILES: [
    { label: "Levels", page: "FILE_LEVELS" },
    { label: "Save",   page: "FILE_SAVE" },
    { label: "Load",   page: "FILE_LOAD" },
  ],

  ENTITIES: [
    { label: "NPCs",     page: "ENTITY_NPCS" },
    { label: "Enemies",  page: "ENTITY_ENEMIES" },
    { label: "Pickups",  page: "ENTITY_PICKUPS" },
  ],
};
