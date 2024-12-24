import { readFileSync } from 'fs';
import { createHash } from 'node:crypto';
import { cpSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { deflateSync, inflateSync } from 'node:zlib';

export class FileManager {
  static readFile(pathStr: string) {
    const file = readFileSync(pathStr);
    if (!file) {
      return null;
    }
    const inflateFile = inflateSync(new Uint8Array(file));
    const FileDecoded = new TextDecoder('utf8').decode(inflateFile);
    const regex = /(?<content>{.*})(?<hash>.*)/gs;
    const regexResult = regex.exec(FileDecoded);
    const fileContent = regexResult?.groups?.content;
    return fileContent || '';
  }

  static excelDateToJSDate(excelDate: number) {
    // Excel date starts on January 1, 1900
    const excelBaseDate = new Date(1900, 0, 1);

    // Correct for Excel's leap year bug (it wrongly considers 1900 a leap year)
    const correctedExcelDate = excelDate - 1;

    // Get the total number of milliseconds
    const milliseconds = correctedExcelDate * 24 * 60 * 60 * 1000;

    // Create the JavaScript date
    return new Date(excelBaseDate.getTime() + milliseconds);
  }

  private static calcMD5(content: string, pathParts: string[]) {
    // see scr_slotSaveDataMapSave in decompiled game code:
    /** salt: "stOne!characters_v1!" + character_N + "!" + save_folder + "!shArd"
     * Eg. stOne!characters_v1!character_1!autosave_1!shArd */
    const characterFolder = pathParts[pathParts.length - 3];
    const characterSaveFolder = pathParts[pathParts.length - 2];
    const salt: string = `stOne!characters_v1!${characterFolder}!${characterSaveFolder}!shArd`;

    const md5Input = Buffer.from(content + salt, 'utf8');
    const md5Hash = createHash('md5').update(md5Input).digest('hex');

    return md5Hash;
  }

  static async saveFile(fileContent: string, pathStr: string) {
    const pathParts: string[] = pathStr.split(path.sep);

    let content = fileContent;
    content += this.calcMD5(content, pathParts);
    try {
      // file written successfully
      const deflate = deflateSync(new TextEncoder().encode(content));
      cpSync(pathStr, `${pathStr}.bak`);
      writeFileSync(pathStr, deflate);
      return true;
    } catch (err) {
      return false;
    }
  }
}
