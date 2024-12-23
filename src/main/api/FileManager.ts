import { readFileSync } from 'fs';
import { inflateSync } from 'node:zlib';

export class FileManager {
  static readFile(path: string) {
    const file = readFileSync(path);
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
}
