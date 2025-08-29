const { contextBridge, ipcRenderer } = require("electron");
const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000" // Your Express server
    : "http://localhost:3001"; // Same in production (you already use 3001)
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
  // NEW: Fetch any server API
  fetchAPI: async (endpoint, options = {}) => {
    try {
      const res = await fetch(`${SERVER_URL}${endpoint}`, {
        method: options.method || "GET",
        headers: { "Content-Type": "application/json" },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
});

// Handle window controls
ipcRenderer.on("window-minimized", () => {
  // Handle window minimized event
});

ipcRenderer.on("window-maximized", () => {
  // Handle window maximized event
});
