import { SKILLS_TREE } from '@shared/constants/skills';

export class CharacterAbility {
  skillId: string;
  isActive: boolean;
  isLocked: boolean;
  skillName: string;
  iconPath?: string;
  category?: string;
  tier?: number;
  immutable: boolean = false;

  constructor(skillId: string, isActive: boolean, isLocked: boolean) {
    this.skillId = skillId;
    this.isActive = !!isActive;
    this.isLocked = !!isLocked;

    const skill = SKILLS_TREE[skillId];
    this.skillName = skill?.name || skillId;
    if (skill) {
      if (skill.category === 'Basic Skills') {
        this.immutable = true;
      }
      this.iconPath = skill.icon;
      this.category = skill.category;
      this.tier = skill.tier;
    }
  }
}
