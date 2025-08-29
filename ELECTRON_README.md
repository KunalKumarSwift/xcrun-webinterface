# 🖥️ xcrun Simctl Desktop App

This project now includes a **standalone desktop application** built with Electron that runs on Windows, macOS, and Linux!

## ✨ Features

- **Cross-platform compatibility** - Works on Windows, macOS, and Linux
- **Native desktop experience** - No need to run separate servers
- **Integrated backend** - Express server runs within the Electron app
- **Modern UI** - Beautiful React interface with Tailwind CSS
- **Full functionality** - All xcrun simctl commands available

## 🚀 Quick Start

### Development Mode

```bash
# Start the Electron app in development mode
npm run electron-dev
```

This will:

1. Start the backend server
2. Start the React development server
3. Launch the Electron app

### Production Build

```bash
# Build the React app
npm run build

# Run the Electron app
npm run electron
```

## 📦 Building Distributables

### For macOS

```bash
npm run electron-pack-mac
```

Creates a `.dmg` file in the `dist` folder.

### For Windows

```bash
npm run electron-pack-win
```

Creates an `.exe` installer in the `dist` folder.

### For Linux

```bash
npm run electron-pack-linux
```

Creates an `AppImage` file in the `dist` folder.

### For All Platforms

```bash
npm run electron-pack
```

Creates distributables for all platforms.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Main Process                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Main Process  │  │  Express Server │  │   IPC       │ │
│  │   (main.js)     │  │  (server.js)    │  │   Bridge    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Electron Renderer Process                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              React App (Frontend)                      │ │
│  │  • Dashboard                                           │ │
│  │  • Device Management                                   │ │
│  │  • Runtime Management                                  │ │
│  │  • App Management                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration

### Main Process (`main.js`)

- Creates the Electron window
- Manages the application lifecycle
- Handles window controls and menus

### Preload Script (`preload.js`)

- Provides secure APIs for the renderer process
- Bridges communication between main and renderer
- Exposes system capabilities safely

### Build Configuration (`package.json`)

- Defines build targets for different platforms
- Configures app metadata and icons
- Sets up file inclusion and packaging

## 🎯 Platform-Specific Notes

### macOS

- Native menu bar integration
- Proper app bundle structure
- DMG installer support

### Windows

- NSIS installer
- Windows-specific icons
- Proper registry integration

### Linux

- AppImage format for easy distribution
- Desktop integration
- Package manager compatibility

## 🚨 Important Notes

1. **macOS Only**: The `xcrun simctl` commands only work on macOS due to Xcode requirements
2. **Permissions**: May need to grant full disk access for system commands
3. **Development**: Use `npm run electron-dev` for development with hot reloading
4. **Production**: Use `npm run electron` for production builds

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000 and 3001 are available
2. **Permission errors**: Grant necessary permissions to the Electron app
3. **Build failures**: Ensure all dependencies are installed

### Debug Mode

```bash
# Enable Electron DevTools
npm run electron-dev
```

DevTools will open automatically in development mode.

## 🔮 Future Enhancements

- [ ] Native notifications
- [ ] System tray integration
- [ ] Auto-updates
- [ ] File drag & drop
- [ ] Keyboard shortcuts
- [ ] Custom themes

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [React in Electron](https://www.electronjs.org/docs/tutorial/quick-start#create-a-react-app)






