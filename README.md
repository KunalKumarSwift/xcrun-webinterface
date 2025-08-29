# xcrun Simctl Web Interface

A modern web interface for managing iOS Simulator devices using `xcrun simctl` commands. Built with Node.js, Express, React, and Tailwind CSS.

## Features

### 🚀 Device Management

- **Create Devices**: Add new simulator devices with custom names, device types, and runtimes
- **Boot/Shutdown**: Start and stop simulator devices
- **Delete Devices**: Remove unwanted simulator devices
- **Reset Devices**: Clear device content and settings
- **Device Status**: Real-time monitoring of device states

### 📱 App Management

- **Install Apps**: Install .app files on simulator devices
- **Launch Apps**: Start applications on running devices
- **Terminate Apps**: Stop running applications
- **Uninstall Apps**: Remove applications from devices

### ⚙️ Runtime & Device Types

- **iOS Runtimes**: View available iOS versions and capabilities
- **Device Types**: Browse hardware configurations (iPhone, iPad, Apple TV, Apple Watch)
- **Device Creation**: Create devices with specific hardware and iOS combinations

### 🎨 Modern UI/UX

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live status updates and command execution
- **Intuitive Navigation**: Clean, organized interface with clear sections
- **Loading States**: Visual feedback for all operations

## Prerequisites

- **macOS**: This application runs on macOS and requires Xcode to be installed
- **Node.js**: Version 16 or higher
- **Xcode Command Line Tools**: Ensure `xcrun` is available in your PATH

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd xcrun-webinterface
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

## Usage

### Development Mode

1. **Start the backend server**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm start
   ```
   The React app will open in your browser at `http://localhost:3000`

### Production Mode

1. **Build the frontend**

   ```bash
   npm run build
   ```

2. **Start the production server**

   ```bash
   npm start
   ```

3. **Access the application**
   Open `http://localhost:5000` in your browser

## API Endpoints

### Devices

- `GET /api/devices` - List all devices
- `POST /api/devices/boot` - Boot a device
- `POST /api/devices/shutdown` - Shutdown a device
- `POST /api/devices/create` - Create a new device
- `DELETE /api/devices/:deviceId` - Delete a device
- `POST /api/devices/reset` - Reset device content
- `POST /api/devices/open` - Open device in Simulator

### Apps

- `POST /api/devices/install` - Install an app
- `POST /api/devices/uninstall` - Uninstall an app
- `POST /api/devices/launch` - Launch an app
- `POST /api/devices/terminate` - Terminate an app

### System Information

- `GET /api/runtimes` - List available runtimes
- `GET /api/devicetypes` - List available device types

## Common Commands

### Device Management

```bash
# List all devices
xcrun simctl list devices

# Boot a device
xcrun simctl boot <device-id>

# Shutdown a device
xcrun simctl shutdown <device-id>

# Create a new device
xcrun simctl create "iPhone 15 Pro" "iPhone 15 Pro" "iOS 17.0"

# Delete a device
xcrun simctl delete <device-id>
```

### App Management

```bash
# Install an app
xcrun simctl install <device-id> "/path/to/app.app"

# Launch an app
xcrun simctl launch <device-id> <bundle-id>

# Terminate an app
xcrun simctl terminate <device-id> <bundle-id>

# Uninstall an app
xcrun simctl uninstall <device-id> <bundle-id>
```

## Project Structure

```
xcrun-webinterface/
├── server.js                 # Express server with API endpoints
├── package.json             # Backend dependencies
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # React entry point
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
└── README.md               # This file
```

## Troubleshooting

### Common Issues

1. **"xcrun: command not found"**

   - Ensure Xcode is installed and up to date
   - Run `xcode-select --install` to install command line tools

2. **Permission denied errors**

   - Make sure the application has necessary permissions
   - Check that your user has access to the simulator directories

3. **Devices not showing up**

   - Verify that Xcode Simulator is working correctly
   - Try running `xcrun simctl list devices` in terminal first

4. **Port already in use**
   - Change the port in `server.js` or kill the process using the port
   - Use `lsof -i :5000` to find what's using the port

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=* npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:

- Check the troubleshooting section above
- Review the API documentation
- Open an issue on GitHub

## Roadmap

- [ ] Real-time device monitoring
- [ ] Batch operations support
- [ ] Command history and logging
- [ ] Advanced device configuration
- [ ] Performance metrics
- [ ] Multi-user support
- [ ] API rate limiting
- [ ] Authentication system






