const { app, BrowserWindow, ipcMain, dialog } = require("electron");

function createWindow() {
  const win = new BrowserWindow ({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

// IPC HANDLERS

// Return default app path for user data
ipcMain.handle("get-user-data-path", () => app.getPath("userData"));

// Show save dialog for JSON file
ipcMain.handle("select-json-path", async (event, defaultFileName = "my_poems.json") => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Choose where to save your poems",
    defaultPath: defaultFileName,
    filters: [{ name: "JSON Files", extensions: ["json"] }]
  });

  if (canceled || !filePath) return null;
  return filePath;
});

// Show dialog to select an audio file
ipcMain.handle("select-audio", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Audio Files", extensions: ["mp3", "wav"] }]
  });

  if (result.canceled || !result.filePaths.length) return null;
  return result.filePaths[0];
});

app.whenReady().then(createWindow);