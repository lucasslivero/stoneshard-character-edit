import { CharacterSave } from './CharacterSave';

export class CharactersTree {
  charName: string;
  charDir: string;
  creationDate: Date;
  saves: CharacterSave[];

  constructor(charName: string, charDir: string, creationDate: Date) {
    this.charDir = charDir;
    this.charName = charName;
    this.creationDate = creationDate;
    this.saves = [];
  }
}
