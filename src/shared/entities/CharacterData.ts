import { ICharacterSaveFile } from '@shared/types/CharacterDataFile';

import { CharacterAbility } from './CharacterAbility';
import { CharacterStatus } from './CharacterStatus';

export class CharacterData {
  status: CharacterStatus;
  gameTime: string;
  abilities: CharacterAbility[] = [];

  constructor(data: ICharacterSaveFile) {
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
      const points = data.skillsDataMap.skillsAllDataList[i + 2] as number;
      const isUnlocked = data.skillsDataMap.skillsAllDataList[i + 3] as boolean;
      const additionalPoints = data.skillsDataMap.skillsAllDataList[i + 4] as number;
      const skillIndex = i;
      this.abilities.push(
        new CharacterAbility(skillName, isActive, points, isUnlocked, additionalPoints, skillIndex),
      );
    }
  }
}
