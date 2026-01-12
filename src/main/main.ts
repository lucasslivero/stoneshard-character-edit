import { existsSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, net, protocol } from "electron";
import started from "electron-squirrel-startup";
import icon from "../../public/icon.png";
import { createIpcHandler } from "./api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IS_DEV = !!MAIN_WINDOW_VITE_DEV_SERVER_URL;

if (started) {
  app.quit();
}

// Register scheme BEFORE app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      bypassCSP: true,
      supportFetchAPI: true,
      stream: true,
    },
  },
]);

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
      devTools: IS_DEV,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "right" });
  } else {
    mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.maximize();
}

app.whenReady().then(() => {
  protocol.handle("app", async (request) => {
    try {
      // Remove 'app://' from the URL
      const url = request.url.slice("app://".length);

      // Decode URI component to handle special characters
      const decodedUrl = decodeURIComponent(url);

      // Determine the base path based on the URL
      let filePath: string;
      if (decodedUrl.startsWith("assets/")) {
        if (app.isPackaged) {
          filePath = join(process.resourcesPath, "public", decodedUrl);
        } else {
          filePath = join(__dirname, "..", "..", "public", decodedUrl);
        }
      } else {
        filePath = decodedUrl;
      }

      // Normalize the path to prevent directory traversal attacks
      const normalizedPath = normalize(filePath);

      // Check if file exists
      if (!existsSync(normalizedPath)) {
        return new Response("File not found", {
          status: 404,
          headers: { "content-type": "text/plain" },
        });
      }

      // Return the file using net.fetch
      return net.fetch(`file://${normalizedPath}`);
    } catch (error) {
      console.error("Protocol handler error:", error);
      return new Response("Internal server error", {
        status: 500,
        headers: { "content-type": "text/plain" },
      });
    }
  });

  createWindow();
  createIpcHandler();
});

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
