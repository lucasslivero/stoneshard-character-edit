export class CharacterAbility {
  skillName: string;
  isActive: boolean;
  points: number;
  isUnlocked: boolean;
  additionalPoints: number;
  skillIndex: number;

  constructor(
    skillName: string,
    isActive: boolean,
    points: number,
    isUnlocked: boolean,
    additionalPoints: number,
    skillIndex: number,
  ) {
    this.skillName = skillName;
    this.isActive = isActive;
    this.points = points;
    this.isUnlocked = isUnlocked;
    this.additionalPoints = additionalPoints;
    this.skillIndex = skillIndex;
  }
}
