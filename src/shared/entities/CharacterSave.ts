export class CharacterSave {
  saveName: string;
  path: string;
  saveDate: Date;
  lastLocation: string;

  constructor(saveName: string, path: string, saveDate: Date, lastLocation: string) {
    this.saveName = saveName;
    this.saveDate = saveDate;
    this.path = path;
    this.lastLocation = lastLocation;
  }
}
