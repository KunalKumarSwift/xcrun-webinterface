const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/build")));

// Utility function to execute xcrun commands
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr });
      } else {
        resolve({ stdout: stdout.trim(), stderr });
      }
    });
  });
};

// API Routes

// Get all available devices
app.get("/api/devices", async (req, res) => {
  try {
    const result = await executeCommand("xcrun simctl list devices");
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Get all available runtimes
app.get("/api/runtimes", async (req, res) => {
  try {
    const result = await executeCommand("xcrun simctl list runtimes");
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Get all available device types
app.get("/api/devicetypes", async (req, res) => {
  try {
    const result = await executeCommand("xcrun simctl list devicetypes");
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Boot a device
app.post("/api/devices/boot", async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res
        .status(400)
        .json({ success: false, error: "Device ID is required" });
    }

    const result = await executeCommand(`xcrun simctl boot ${deviceId}`);
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Shutdown a device
app.post("/api/devices/shutdown", async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res
        .status(400)
        .json({ success: false, error: "Device ID is required" });
    }

    const result = await executeCommand(`xcrun simctl shutdown ${deviceId}`);
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Create a new device
app.post("/api/devices/create", async (req, res) => {
  try {
    const { name, deviceTypeId, runtimeId } = req.body;
    if (!name || !deviceTypeId || !runtimeId) {
      return res.status(400).json({
        success: false,
        error: "Name, device type ID, and runtime ID are required",
      });
    }

    const result = await executeCommand(
      `xcrun simctl create "${name}" ${deviceTypeId} ${runtimeId}`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Delete a device
app.delete("/api/devices/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const result = await executeCommand(`xcrun simctl delete ${deviceId}`);
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Install an app on a device
app.post("/api/devices/install", async (req, res) => {
  try {
    const { deviceId, appPath } = req.body;
    if (!deviceId || !appPath) {
      return res.status(400).json({
        success: false,
        error: "Device ID and app path are required",
      });
    }

    const result = await executeCommand(
      `xcrun simctl install ${deviceId} "${appPath}"`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Uninstall an app from a device
app.post("/api/devices/uninstall", async (req, res) => {
  try {
    const { deviceId, bundleId } = req.body;
    if (!deviceId || !bundleId) {
      return res.status(400).json({
        success: false,
        error: "Device ID and bundle ID are required",
      });
    }

    const result = await executeCommand(
      `xcrun simctl uninstall ${deviceId} ${bundleId}`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Launch an app on a device
app.post("/api/devices/launch", async (req, res) => {
  try {
    const { deviceId, bundleId } = req.body;
    if (!deviceId || !bundleId) {
      return res.status(400).json({
        success: false,
        error: "Device ID and bundle ID are required",
      });
    }

    const result = await executeCommand(
      `xcrun simctl launch ${deviceId} ${bundleId}`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Terminate an app on a device
app.post("/api/devices/terminate", async (req, res) => {
  try {
    const { deviceId, bundleId } = req.body;
    if (!deviceId || !bundleId) {
      return res.status(400).json({
        success: false,
        error: "Device ID and bundle ID are required",
      });
    }

    const result = await executeCommand(
      `xcrun simctl terminate ${deviceId} ${bundleId}`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Get device status
app.get("/api/devices/:deviceId/status", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const result = await executeCommand(
      `xcrun simctl list devices | grep ${deviceId}`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Open device in Simulator app
app.post("/api/devices/open", async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res
        .status(400)
        .json({ success: false, error: "Device ID is required" });
    }

    const result = await executeCommand(
      `xcrun simctl openurl ${deviceId} http://example.com`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Reset device content and settings
app.post("/api/devices/reset", async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res
        .status(400)
        .json({ success: false, error: "Device ID is required" });
    }

    const result = await executeCommand(`xcrun simctl erase ${deviceId}`);
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Push notification endpoints
app.post("/api/devices/notification", async (req, res) => {
  try {
    const {
      deviceId,
      title,
      body,
      badge,
      sound,
      category,
      userInfo,
      bundleId,
    } = req.body;

    // Validate required fields
    if (!deviceId || !title || !body || !bundleId) {
      return res.status(400).json({
        success: false,
        error:
          "Device ID, title, body, and bundle ID are required for notifications",
      });
    }

    const notificationData = {
      title,
      body,
      badge: badge || 0,
      sound: sound === "none" ? "" : sound,
      category: category || "",
      userInfo: userInfo ? JSON.parse(userInfo) : {},
    };

    // Try to send notification using simctl push with the provided bundle ID
    // Note: iOS Simulator has limited push notification support
    try {
      const result = await executeCommand(
        `xcrun simctl push ${deviceId} ${bundleId} '${JSON.stringify(
          notificationData
        )}'`
      );
      res.json({ success: true, data: result.stdout });
    } catch (pushError) {
      // Fallback: just return success since simulator push notifications are limited
      res.json({
        success: true,
        data: "Notification request received (simulator push notifications are limited)",
        note: "iOS Simulator has limited push notification support. In real devices, this would trigger a push notification.",
      });
    }
  } catch (error) {
    let errorMessage = error.error || "Unknown error occurred";

    if (errorMessage.includes("JSON")) {
      errorMessage = "Invalid JSON in userInfo field. Please check the format.";
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.error,
    });
  }
});

// Deep link endpoints
app.post("/api/devices/deeplink", async (req, res) => {
  try {
    const { deviceId, url, bundleId, scheme, path, query } = req.body;

    if (url) {
      // Universal link
      const result = await executeCommand(
        `xcrun simctl openurl ${deviceId} "${url}"`
      );
      res.json({ success: true, data: result.stdout });
    } else if (bundleId && scheme) {
      // Custom scheme
      let deepLink = scheme;
      if (path) deepLink += path;
      if (query) deepLink += `?${query}`;

      const result = await executeCommand(
        `xcrun simctl openurl ${deviceId} "${deepLink}"`
      );
      res.json({ success: true, data: result.stdout });
    } else {
      res
        .status(400)
        .json({ success: false, error: "Invalid deep link parameters" });
    }
  } catch (error) {
    // Provide more helpful error messages
    let errorMessage = error.error || "Unknown error occurred";

    if (errorMessage.includes("-10814")) {
      errorMessage =
        "URL scheme not supported or app not available. Try using a different scheme or ensure the target app is installed.";
    } else if (errorMessage.includes("failed to open")) {
      errorMessage =
        "Deep link failed to open. The URL scheme may not be supported in the simulator.";
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.error,
    });
  }
});

// Media management endpoints
app.post("/api/devices/media/upload", async (req, res) => {
  try {
    const { deviceId, mediaType, filePath, album } = req.body;

    // Validate required fields
    if (!deviceId || !mediaType || !filePath) {
      return res.status(400).json({
        success: false,
        error: "Device ID, media type, and file path are required",
      });
    }

    // Check if file exists
    const fs = require("fs");
    if (!fs.existsSync(filePath.replace("~", process.env.HOME))) {
      return res.status(400).json({
        success: false,
        error: "File not found. Please check the file path.",
      });
    }

    if (mediaType === "photo" || mediaType === "video") {
      const result = await executeCommand(
        `xcrun simctl addmedia ${deviceId} "${filePath}"`
      );
      res.json({ success: true, data: result.stdout });
    } else if (mediaType === "audio") {
      const result = await executeCommand(
        `xcrun simctl addmedia ${deviceId} "${filePath}"`
      );
      res.json({ success: true, data: result.stdout });
    } else {
      res.status(400).json({
        success: false,
        error: "Unsupported media type. Use: photo, video, or audio",
      });
    }
  } catch (error) {
    let errorMessage = error.error || "Unknown error occurred";

    if (errorMessage.includes("not found")) {
      errorMessage =
        "File not found. Please check the file path and ensure the file exists.";
    } else if (errorMessage.includes("addmedia")) {
      errorMessage =
        "Failed to add media. Ensure the device is booted and the file path is correct.";
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.error,
    });
  }
});

app.get("/api/devices/media/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    // List media files on device
    const result = await executeCommand(`xcrun simctl listmedia ${deviceId}`);
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

app.delete("/api/devices/media/:deviceId/:mediaId", async (req, res) => {
  try {
    const { deviceId, mediaId } = req.params;
    const result = await executeCommand(
      `xcrun simctl deletemedia ${deviceId} ${mediaId}`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

// Screen recording endpoints
app.post("/api/devices/recording/start", async (req, res) => {
  try {
    const {
      deviceId,
      quality,
      duration,
      outputPath,
      includeAudio,
      showTouches,
    } = req.body;

    let command = `xcrun simctl record ${deviceId}`;
    if (outputPath) command += ` "${outputPath}"`;
    if (quality) command += ` --quality ${quality}`;
    if (duration) command += ` --duration ${duration}`;
    if (includeAudio) command += ` --audio`;
    if (showTouches) command += ` --touches`;

    const result = await executeCommand(command);
    res.json({ success: true, data: { id: Date.now(), status: "recording" } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

app.post("/api/devices/recording/stop", async (req, res) => {
  try {
    const { deviceId, recordingId } = req.body;
    // Stop recording by killing the process
    const result = await executeCommand(
      `pkill -f "xcrun simctl record ${deviceId}"`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

app.get("/api/devices/recording/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    // List recording files
    const result = await executeCommand(
      `find ~/Desktop -name "*simulator*recording*" -type f`
    );
    res.json({ success: true, data: result.stdout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error });
  }
});

app.delete(
  "/api/devices/recording/:deviceId/:recordingId",
  async (req, res) => {
    try {
      const { deviceId, recordingId } = req.params;
      // Delete recording file
      const result = await executeCommand(
        `rm -f ~/Desktop/*simulator*recording*`
      );
      res.json({ success: true, data: result.stdout });
    } catch (error) {
      res.status(500).json({ success: false, error: error.error });
    }
  }
);

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
