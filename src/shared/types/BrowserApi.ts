import { CharacterData } from '@shared/entities/CharacterData';
import { CharactersTree } from '@shared/entities/CharactersTree';

type GetSaves = (path?: string) => Promise<{ saves: CharactersTree[]; path: string }>;
type GetCharacterSaveData = (
  saveRootDir: string,
  charDir: string,
  saveName: string,
) => Promise<CharacterData>;
export interface IBrowserApi {
  getSaves: GetSaves;
  openFileDialog: () => Promise<string | null>;
  getCharacterSaveData: GetCharacterSaveData;
}
