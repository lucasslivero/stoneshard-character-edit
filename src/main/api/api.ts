import { existsSync, readdirSync, statSync } from 'fs';
import { homedir, platform } from 'os';
import { join, resolve, sep } from 'path';

import { dialog } from 'electron';

import { CharacterData } from '@shared/entities/CharacterData';
import { CharacterSave } from '@shared/entities/CharacterSave';
import { CharactersTree } from '@shared/entities/CharactersTree';
import { ICharacterSaveFile } from '@shared/types/CharacterDataFile';
import { FormSchema } from '@shared/types/Form';

import { FileManager } from './FileManager';

const DEFAULT_CHARACTER_PATH_NAME = 'characters_v1';

async function getSaves(path: string | null, isWsl: boolean) {
  let mainPath = '';
  if (!path) {
    if (isWsl) {
      const userPath = process.env.WUSER;
      mainPath = resolve(userPath ?? '', 'AppData', 'Local', 'StoneShard');
    } else if (platform() === 'linux') {
      mainPath = resolve(homedir(), '.config', 'StoneShard');
    } else {
      mainPath = resolve(homedir(), 'AppData', 'Local', 'StoneShard');
    }
  } else {
    const splitPath = path.split(sep);
    const rootPathIndex = splitPath.indexOf('StoneShard');
    if (rootPathIndex !== -1) {
      mainPath = resolve(splitPath.slice(0, rootPathIndex + 1).join(sep));
    }
  }

  if (!mainPath) {
    return null;
  }

  const characterPath = join(mainPath, DEFAULT_CHARACTER_PATH_NAME);
  if (!existsSync(characterPath)) {
    return null;
  }

  const charactersTree: CharactersTree[] = [];
  const allCharacters = readdirSync(characterPath).filter((item) => !item.includes('.'));
  allCharacters.forEach((characterDir) => {
    const characterAllSaves = readdirSync(join(characterPath, characterDir));
    const characterInfoPath = characterAllSaves.splice(
      characterAllSaves.indexOf('character.map'),
      1,
    )[0];
    const charPath = join(characterPath, characterDir, characterInfoPath);
    const characterContent = FileManager.readFile(charPath);
    if (!characterContent) {
      return;
    }
    const characterInfoFile = JSON.parse(characterContent);

    const characterInfoDir = statSync(charPath);

    const characterInfo = new CharactersTree(
      characterInfoFile.nameKey,
      characterDir,
      characterInfoDir.birthtime,
    );

    characterAllSaves.forEach((saveDir) => {
      const savePath = join(characterPath, characterDir, saveDir, 'save.map');
      const saveContent = FileManager.readFile(savePath);
      if (!saveContent) {
        return;
      }
      const saveData = JSON.parse(saveContent);
      characterInfo.saves.push(
        new CharacterSave(
          saveDir,
          join(sep + DEFAULT_CHARACTER_PATH_NAME, characterDir, saveDir + sep),
          FileManager.excelDateToJSDate(saveData.dateTime),
          saveData.locationTitleKey,
        ),
      );
    });

    characterInfo.saves.sort((a, b) => b.saveDate.getTime() - a.saveDate.getTime());

    charactersTree.push(characterInfo);
  });

  return { saves: charactersTree, path: mainPath };
}

async function openFileDialog() {
  const response = await dialog.showOpenDialog({
    properties: ['openDirectory', 'showHiddenFiles'],
  });
  if (response.canceled) {
    return null;
  }

  return response.filePaths[0];
}

async function getCharacterSaveData(saveRootDir: string, charDir: string, saveName: string) {
  const path = join(saveRootDir, DEFAULT_CHARACTER_PATH_NAME, charDir, saveName, 'data.sav');
  const content = FileManager.readFile(path);
  if (!content) {
    return null;
  }
  const data: ICharacterSaveFile = JSON.parse(content);

  return new CharacterData(data);
}

function modifyData(fileContent: string, data: FormSchema): string {
  const characterData: ICharacterSaveFile = JSON.parse(fileContent);
  characterData.characterDataMap.Vitality = data.vitality;
  characterData.characterDataMap.STR = data.strength;
  characterData.characterDataMap.AGL = data.agility;
  characterData.characterDataMap.PRC = data.perception;
  characterData.characterDataMap.WIL = data.willpower;
  characterData.characterDataMap.AP = data.abilityPoints;
  characterData.characterDataMap.SP = data.statsPoints;
  for (let i = 0; i < characterData.skillsDataMap.skillsAllDataList.length; i += 5) {
    const skillId = characterData.skillsDataMap.skillsAllDataList[i] as string;
    const hasItem = !!data.abilities.find((item) => item.skillId === skillId);
    characterData.skillsDataMap.skillsAllDataList[i + 1] = hasItem; // true == active | false == inactive
    if (hasItem) {
      characterData.skillsDataMap.skillsAllDataList[i + 3] = !hasItem; //  false == unlocked | true == locked
    }
  }
  return JSON.stringify(characterData);
}

async function newSave(saveRootDir: string, charDir: string, saveName: string, data: FormSchema) {
  const path = join(saveRootDir, DEFAULT_CHARACTER_PATH_NAME, charDir, saveName, 'data.sav');
  const content = FileManager.readFile(path);
  if (!content) {
    return false;
  }
  const newFileContent = modifyData(content, data);
  const success = await FileManager.saveFile(newFileContent, path);
  return success;
}

async function unlockSkills(saveRootDir: string, charDir: string, saveName: string) {
  const path = join(saveRootDir, DEFAULT_CHARACTER_PATH_NAME, charDir, saveName, 'data.sav');
  const content = FileManager.readFile(path);
  if (!content) {
    return false;
  }
  const data: ICharacterSaveFile = JSON.parse(content);
  for (let i = 0; i < data.skillsDataMap.skillsAllDataList.length; i += 5) {
    data.skillsDataMap.skillsAllDataList[i + 3] = false;
  }
  const newFileContent = JSON.stringify(data);
  const success = await FileManager.saveFile(newFileContent, path);
  return success;
}

export { getCharacterSaveData, getSaves, newSave, openFileDialog, unlockSkills };
