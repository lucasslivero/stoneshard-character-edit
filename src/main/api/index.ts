/* eslint-disable @typescript-eslint/no-explicit-any */
import { pathToFileURL } from 'node:url';

import { ipcMain, net, protocol } from 'electron';

import * as ipcHandlers from './api';

function addInIpcChannel(fnName: string, fn: (...args: any[]) => void): void {
  ipcMain.handle(fnName, (_channel, ...args) => fn(...args));
}

function fileConfigurationHandler() {
  protocol.handle('atom', (request) => {
    const filePath = request.url.slice('atom://'.length);
    return net.fetch(pathToFileURL(filePath).toString());
  });
}

export function createIpcHandler(): void {
  fileConfigurationHandler();
  Object.keys(ipcHandlers).forEach((key) => {
    addInIpcChannel(key, ipcHandlers[key]);
  });
}
