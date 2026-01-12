import { ipcMain } from "electron";

import * as ipcHandlers from "./api";

export function createIpcHandler(): void {
  Object.keys(ipcHandlers).forEach((key) => {
    ipcMain.handle(key, (_channel, ...args) => ipcHandlers[key](...args));
  });
}
