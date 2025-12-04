import { Palette } from "../pages/palette.js";
import { AudioAssetsPage } from "../pages/audioAssetsPage.js";
// import more later: AudioPatternPage, LogicPage, etc

export const PAGE_TYPES = {
  PALETTE:      Palette,
  AUDIO_ASSETS: AudioAssetsPage,
  // AUDIO_PATTERN: AudioPatternPage,
  // LOGIC_TRIGGERS: LogicTriggersPage,
  // …
};

export const BOOKS = [
  { label: "Tiles",    ref: "TILES" },
  { label: "Audio",    ref: "AUDIO" },
  { label: "Entities", ref: "ENTITIES" },
  { label: "Logic",    ref: "LOGIC" },
  { label: "Files",    ref: "FILES" },
];


export const PAGES = {

  TILES: [
    { label: "world_tileset", page: "WORLD_TILESET", type: "PALETTE", atlas: "world_tileset" },
    { label: "coin",          page: "COIN",          type: "PALETTE", atlas: "coin" },
    { label: "fruits",        page: "FRUITS",        type: "PALETTE", atlas: "fruits" },
  ],

  AUDIO: [
    { label: "Assets",  page: "AUDIO_ASSETS",  type: "AUDIO_ASSETS" },
    { label: "Pattern", page: "AUDIO_PATTERN", type: "AUDIO_PATTERN" }, 
  ],

  LOGIC: [
    { label: "Triggers", page: "LOGIC_TRIGGERS", type: "LOGIC_TRIGGERS" },
    { label: "Events",   page: "LOGIC_EVENTS",   type: "LOGIC_EVENTS" },
  ],

  FILES: [
    { label: "Levels", page: "FILE_LEVELS", type: "LEVELS_PAGE" },
    { label: "Save",   page: "FILE_SAVE",   type: "FILE_SAVE_PAGE" },
    { label: "Load",   page: "FILE_LOAD",   type: "FILE_LOAD_PAGE" },
  ],

  ENTITIES: [
    { label: "NPCs",     page: "ENTITY_NPCS",    type: "ENTITY_LIST" },
    { label: "Enemies",  page: "ENTITY_ENEMIES", type: "ENTITY_LIST" },
    { label: "Pickups",  page: "ENTITY_PICKUPS", type: "ENTITY_LIST" },
  ],
};
