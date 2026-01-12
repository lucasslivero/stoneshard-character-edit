import type { CharacterData } from "@shared/entities/CharacterData";
import type { CharactersTree } from "@shared/entities/CharactersTree";

import type { FormSchema } from "./Form";

export const BrowserApis = [
  "getSaves",
  "openFileDialog",
  "getCharacterSaveData",
  "newSave",
  "unlockSkills",
];
export interface IBrowserApi {
  getSaves: (
    path: string | null,
    isWsl: boolean,
  ) => Promise<{ saves: CharactersTree[]; path: string }>;

  openFileDialog: () => Promise<string | null>;

  getCharacterSaveData: (
    saveRootDir: string,
    charDir: string,
    saveName: string,
  ) => Promise<CharacterData>;

  newSave: (
    saveRootDir: string,
    charDir: string,
    saveName: string,
    data: FormSchema,
  ) => Promise<boolean>;

  unlockSkills: (saveRootDir: string, charDir: string, saveName: string) => Promise<boolean>;
}
