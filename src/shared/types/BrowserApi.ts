import { IFileSave } from './FileSave';

export type GetSaves = () => Promise<IFileSave[]>;

export interface IBrowserApi {
  getSaves: GetSaves;
}
