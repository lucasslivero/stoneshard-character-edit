import { CharacterData } from '@shared/entities/CharacterData';
import { CharactersTree } from '@shared/entities/CharactersTree';

import { FormSchema } from './Form';

export const BrowserApis = ['getSaves', 'openFileDialog', 'getCharacterSaveData', 'newSave'];

type GetSaves = (path?: string) => Promise<{ saves: CharactersTree[]; path: string }>;
type GetCharacterSaveData = (
  saveRootDir: string,
  charDir: string,
  saveName: string,
) => Promise<CharacterData>;
type NewSave = (
  saveRootDir: string,
  charDir: string,
  saveName: string,
  data: FormSchema,
) => Promise<boolean>;
export interface IBrowserApi {
  getSaves: GetSaves;
  openFileDialog: () => Promise<string | null>;
  getCharacterSaveData: GetCharacterSaveData;
  newSave: NewSave;
}
