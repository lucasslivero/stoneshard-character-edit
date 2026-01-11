import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow } from "electron";
import started from "electron-squirrel-startup";
import icon from "../../resources/icon.png";
import { createIpcHandler } from "./api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (started) {
  app.quit();
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    title: "Stoneshard Character Editor",
    vibrancy: "under-window",
    visualEffectState: "active",
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      sandbox: true,
      contextIsolation: true,
    },
  });

  createIpcHandler();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.maximize();

  mainWindow.webContents.openDevTools({ mode: "right" });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
