import React, { useState, useEffect, useCallback } from "react";
import {
  Play,
  Square,
  Download,
  RefreshCw,
  Smartphone,
  Package,
} from "lucide-react";
import axios from "axios";

const Apps = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [appPath, setAppPath] = useState("");
  const [bundleId, setBundleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/devices");
      setDevices(parseDevices(response.data.data));
      if (response.data.data) {
        const deviceList = parseDevices(response.data.data);
        if (deviceList.length > 0) {
          setSelectedDevice(deviceList[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      setMessage({
        type: "error",
        text: "Error fetching devices: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const parseDevices = (data) => {
    const lines = data.split("\n");
    const deviceList = [];

    lines.forEach((line) => {
      if (line.includes("(") && line.includes(")")) {
        const match = line.match(/(.+) \((.+)\) \((.+)\)/);
        if (match) {
          deviceList.push({
            name: match[1].trim(),
            id: match[2].trim(),
            status: match[3].trim(),
            isBooted: match[3].trim() === "Booted",
          });
        }
      }
    });

    return deviceList;
  };

  const handleInstallApp = async () => {
    if (!selectedDevice || !appPath) {
      setMessage({
        type: "error",
        text: "Please select a device and provide an app path",
      });
      return;
    }

    try {
      setActionLoading({ install: true });
      setMessage({ type: "", text: "" });

      await axios.post("/api/devices/install", {
        deviceId: selectedDevice,
        appPath: appPath,
      });

      setMessage({ type: "success", text: "App installed successfully!" });
      setAppPath("");
    } catch (error) {
      console.error("Error installing app:", error);
      setMessage({
        type: "error",
        text:
          "Error installing app: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ install: false });
    }
  };

  const handleUninstallApp = async () => {
    if (!selectedDevice || !bundleId) {
      setMessage({
        type: "error",
        text: "Please select a device and provide a bundle ID",
      });
      return;
    }

    try {
      setActionLoading({ uninstall: true });
      setMessage({ type: "", text: "" });

      await axios.post("/api/devices/uninstall", {
        deviceId: selectedDevice,
        bundleId: bundleId,
      });

      setMessage({ type: "success", text: "App uninstalled successfully!" });
      setBundleId("");
    } catch (error) {
      console.error("Error uninstalling app:", error);
      setMessage({
        type: "error",
        text:
          "Error uninstalling app: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ uninstall: false });
    }
  };

  const handleLaunchApp = async () => {
    if (!selectedDevice || !bundleId) {
      setMessage({
        type: "error",
        text: "Please select a device and provide a bundle ID",
      });
      return;
    }

    try {
      setActionLoading({ launch: true });
      setMessage({ type: "", text: "" });

      await axios.post("/api/devices/launch", {
        deviceId: selectedDevice,
        bundleId: bundleId,
      });

      setMessage({ type: "success", text: "App launched successfully!" });
    } catch (error) {
      console.error("Error launching app:", error);
      setMessage({
        type: "error",
        text:
          "Error launching app: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ launch: false });
    }
  };

  const handleTerminateApp = async () => {
    if (!selectedDevice || !bundleId) {
      setMessage({
        type: "error",
        text: "Please select a device and provide a bundle ID",
      });
      return;
    }

    try {
      setActionLoading({ terminate: true });
      setMessage({ type: "", text: "" });

      await axios.post("/api/devices/terminate", {
        deviceId: selectedDevice,
        bundleId: bundleId,
      });

      setMessage({ type: "success", text: "App terminated successfully!" });
    } catch (error) {
      console.error("Error terminating app:", error);
      setMessage({
        type: "error",
        text:
          "Error terminating app: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ terminate: false });
    }
  };

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">App Management</h1>
          <p className="text-gray-600 mt-2">
            Install, launch, and manage apps on your simulator devices
          </p>
        </div>
        <button
          onClick={fetchDevices}
          className="btn-secondary flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button
              onClick={clearMessage}
              className="text-sm font-medium hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Device Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Select Device
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Device
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="input-field"
            >
              <option value="">Select a device</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.status})
                </option>
              ))}
            </select>
          </div>
          {selectedDevice && (
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-gray-600">
                {devices.find((d) => d.id === selectedDevice)?.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* App Installation */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Download className="h-5 w-5 text-green-600 mr-2" />
          Install App
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              App Path (.app file)
            </label>
            <input
              type="text"
              value={appPath}
              onChange={(e) => setAppPath(e.target.value)}
              className="input-field"
              placeholder="/path/to/your/app.app"
            />
            <p className="text-sm text-gray-500 mt-1">
              Provide the full path to your .app file
            </p>
          </div>
          <button
            onClick={handleInstallApp}
            disabled={!selectedDevice || !appPath || actionLoading.install}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading.install ? "Installing..." : "Install App"}
          </button>
        </div>
      </div>

      {/* App Management */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Package className="h-5 w-5 text-blue-600 mr-2" />
          App Management
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bundle Identifier
            </label>
            <input
              type="text"
              value={bundleId}
              onChange={(e) => setBundleId(e.target.value)}
              className="input-field"
              placeholder="com.example.app"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the bundle identifier of the app (e.g., com.apple.Safari)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleLaunchApp}
              disabled={!selectedDevice || !bundleId || actionLoading.launch}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading.launch ? "Launching..." : "Launch App"}
            </button>

            <button
              onClick={handleTerminateApp}
              disabled={!selectedDevice || !bundleId || actionLoading.terminate}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading.terminate ? "Terminating..." : "Terminate App"}
            </button>

            <button
              onClick={handleUninstallApp}
              disabled={!selectedDevice || !bundleId || actionLoading.uninstall}
              className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading.uninstall ? "Uninstalling..." : "Uninstall App"}
            </button>
          </div>
        </div>
      </div>

      {/* Common Bundle IDs */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Common System Apps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">iOS Apps</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Safari:</span>
                <code className="text-primary-600 font-mono">
                  com.apple.Safari
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Settings:</span>
                <code className="text-primary-600 font-mono">
                  com.apple.Preferences
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Messages:</span>
                <code className="text-primary-600 font-mono">
                  com.apple.MobileSMS
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mail:</span>
                <code className="text-primary-600 font-mono">
                  com.apple.mobilemail
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Development</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Xcode:</span>
                <code className="text-primary-600 font-mono">
                  com.apple.dt.Xcode
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Simulator:</span>
                <code className="text-primary-600 font-mono">
                  com.apple.iphonesimulator
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          App Management Guide
        </h3>
        <div className="text-gray-600 space-y-3">
          <p>
            Use this interface to manage applications on your iOS Simulator
            devices:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Install App:</strong> Install a .app file on the selected
              device
            </li>
            <li>
              <strong>Launch App:</strong> Start an installed application
            </li>
            <li>
              <strong>Terminate App:</strong> Stop a running application
            </li>
            <li>
              <strong>Uninstall App:</strong> Remove an application from the
              device
            </li>
          </ul>
          <p>
            <strong>Note:</strong> Make sure your device is booted before
            attempting to install or manage apps. System apps cannot be
            uninstalled, but can be launched and terminated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Apps;
