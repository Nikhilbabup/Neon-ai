const { app, BrowserWindow } = require("electron");
const path = require("path");

const { WINDOW_SIZE } = require("../shared/constants");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: WINDOW_SIZE.width,
    height: WINDOW_SIZE.height,
    minWidth: WINDOW_SIZE.width,
    minHeight: WINDOW_SIZE.height,
    webPreferences: {
      //   preload: path.join(__dirname, "preload.js"), // Optional if you use preload
      nodeIntegration: true, // Needed if using Node.js in renderer
      contextIsolation: false, // Must be false if nodeIntegration is true
      sandbox: false,
      devTools: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
  mainWindow.webContents.openDevTools(); // 👈 Open DevTools

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

console.log(path.join(__dirname, "src", "renderer", "index.html"));

app.whenReady().then(createWindow);

// Recreate window on macOS when dock icon is clicked and no windows are open
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
