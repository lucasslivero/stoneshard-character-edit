/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer } from 'electron';

import { BrowserApis } from '@shared/types/BrowserApi';

type ApiFromHandlers<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]: (
    ...args: Parameters<T[K]> extends [unknown, ...infer R] ? R : never
  ) => Promise<ReturnType<T[K]>>;
};

function createApi<T extends Record<string, (...args: any[]) => any>>(): ApiFromHandlers<T> {
  const api: Partial<ApiFromHandlers<T>> = {};

  BrowserApis.forEach((key) => {
    api[key as keyof T] = (...args: any[]) => ipcRenderer.invoke(key as string, ...args);
  });

  return api as ApiFromHandlers<T>;
}

export const api = createApi();
