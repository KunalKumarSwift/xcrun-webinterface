const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Platform detection
  platform: process.platform,

  // Window controls
  minimize: () => ipcRenderer.send("minimize-window"),
  maximize: () => ipcRenderer.send("maximize-window"),
  close: () => ipcRenderer.send("close-window"),

  // App info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // File operations (if needed later)
  openFile: () => ipcRenderer.invoke("open-file"),
  saveFile: (data) => ipcRenderer.invoke("save-file", data),

  // System commands (for xcrun integration)
  executeCommand: (command) => ipcRenderer.invoke("execute-command", command),

  // Notifications
  showNotification: (title, body) =>
    ipcRenderer.invoke("show-notification", title, body),
});

// Handle window controls
ipcRenderer.on("window-minimized", () => {
  // Handle window minimized event
});

ipcRenderer.on("window-maximized", () => {
  // Handle window maximized event
});






