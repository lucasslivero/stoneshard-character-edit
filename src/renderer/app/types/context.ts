import type { IFileSave } from "./FileSave";

export type GetSaves = () => Promise<IFileSave[]>;

export interface IContext {
  getSaves: GetSaves;
}
