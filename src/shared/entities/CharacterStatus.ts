import { ICharacterDataMap } from '@shared/types/CharacterDataFile';

export class CharacterStatus {
  strength: number;
  agility: number;
  perception: number;
  vitality: number;
  willpower: number;
  abilityPoints: number;
  statsPoints: number;
  level: number;
  xp: number;

  constructor(data: ICharacterDataMap) {
    this.strength = data.STR;
    this.agility = data.AGL;
    this.perception = data.PRC;
    this.vitality = data.Vitality;
    this.willpower = data.WIL;
    this.abilityPoints = data.AP;
    this.statsPoints = data.SP;
    this.level = data.LVL;
    this.xp = data.XP;
  }
}
