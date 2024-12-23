import { existsSync, readdirSync, statSync } from 'fs';
import { homedir, platform } from 'os';
import { join, resolve, sep } from 'path';

import { dialog } from 'electron';

import { CharacterData } from '@shared/entities/CharacterData';
import { CharacterSave } from '@shared/entities/CharacterSave';
import { CharactersTree } from '@shared/entities/CharactersTree';
import { ICharacterSaveFile } from '@shared/types/CharacterDataFile';

import { FileManager } from './FileManager';

const DEFAULT_CHARACTER_PATH_NAME = 'characters_v1';

async function getSaves(path: string) {
  let mainPath = '';
  if (!path) {
    if (platform() === 'linux') {
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

export { getCharacterSaveData, getSaves, openFileDialog };
