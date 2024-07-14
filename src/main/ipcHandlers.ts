/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain } from 'electron';

const ipcHandlers = {
  getSaves: async (params: { packName: string; url: string; name: string; vst: string }) => {
    console.log('downloadPreset', params);
  },
};

function addInIpcChannel(fnName: string, fn: (...args: any[]) => void): void {
  ipcMain.handle(fnName, (_channel, ...args) => fn(...args));
}

export function createIpcHandler(): void {
  Object.keys(ipcHandlers).forEach((key) => {
    addInIpcChannel(key, ipcHandlers[key]);
  });
}
