import type * as ipcHandlers from "./../../main/api/api";

type MainApiInterface = typeof ipcHandlers;
type customApi = {
  locale: string;
};

export type IBrowserApi = MainApiInterface & customApi;
export type ApiKeys = keyof MainApiInterface;
