const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { fork } = require("child_process");
let mainWindow;
let serverProcess;
function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets/icon.png"), // You can add an icon later
    titleBarStyle: "default",
    show: false,
  });

  // Load the app
  if (isDev) {
    // In development, load from React dev server
    mainWindow.loadURL("http://localhost:3001");
    //mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL("http://localhost:3001");
    // In production, load the built React app
    //mainWindow.loadFile(path.join(__dirname, "client/build/index.html"));
  }

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    console.log("Node version:", process.version);
    console.log("Node executable:", process.execPath);
    console.log("Platform:", process.platform);
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// Create window when app is ready
app.whenReady().then(() => {
  serverProcess = fork(path.join(__dirname, "server.js"), [], {
    execPath: process.execPath,
  });
  serverProcess.on("message", (msg) => {
    console.log("[Server message]:", msg);
  });

  serverProcess.on("error", (err) => {
    console.error("[Server error]:", err);
  });

  serverProcess.on("exit", (code) => {
    console.log(`[Server exited with code ${code}]`);
  });
  createWindow();
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Create application menu
const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "Window",
    submenu: [{ role: "minimize" }, { role: "close" }],
  },
];

if (process.platform === "darwin") {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" },
    ],
  });
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
