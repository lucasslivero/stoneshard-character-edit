import { IBodyParts, ICharacterSaveFile } from '@shared/types/CharacterDataFile';

import { CharacterAbility } from './CharacterAbility';
import { CharacterStatus } from './CharacterStatus';

export class CharacterData {
  status: CharacterStatus;
  gameTime: string;
  abilities: CharacterAbility[] = [];
  body: IBodyParts;

  constructor(data: ICharacterSaveFile) {
    this.body = {
      head: Math.trunc(data.characterDataMap.Body.head),
      tors: Math.trunc(data.characterDataMap.Body.tors),
      rhand: Math.trunc(data.characterDataMap.Body.rhand),
      lhand: Math.trunc(data.characterDataMap.Body.lhand),
      rlegs: Math.trunc(data.characterDataMap.Body.rlegs),
      legs: Math.trunc(data.characterDataMap.Body.legs),
    };
    this.status = new CharacterStatus(data.characterDataMap);
    this.gameTime = [
      `${data.timeDataMap.months}M`,
      `${data.timeDataMap.days}d`,
      `${data.timeDataMap.hours}h`,
      `${data.timeDataMap.minutes}m`,
      `${data.timeDataMap.seconds}s`,
    ].join(' ');
    for (let i = 0; i < data.skillsDataMap.skillsAllDataList.length; i += 5) {
      const skillName = data.skillsDataMap.skillsAllDataList[i] as string;
      const isActive = data.skillsDataMap.skillsAllDataList[i + 1] as boolean;
      const isLocked = data.skillsDataMap.skillsAllDataList[i + 3] as boolean;
      this.abilities.push(new CharacterAbility(skillName, isActive, isLocked));
    }
  }
}
