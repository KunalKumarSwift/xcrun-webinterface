import React, { useState, useEffect, useCallback } from "react";
import {
  ExternalLink,
  Send,
  RefreshCw,
  Smartphone,
  Globe,
  FileText,
  Settings,
  XCircle,
} from "lucide-react";
import axios from "axios";

const DeepLinks = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [deepLinkForm, setDeepLinkForm] = useState({
    url: "",
    bundleId: "",
    scheme: "",
    path: "",
    query: "",
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

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

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/devices");
      const deviceList = parseDevices(response.data.data);
      setDevices(deviceList);
      if (deviceList.length > 0) {
        setSelectedDevice(deviceList[0].id);
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

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleOpenDeepLink = async () => {
    if (!selectedDevice || (!deepLinkForm.url && !deepLinkForm.bundleId)) {
      setMessage({
        type: "error",
        text: "Please select a device and provide either a URL or bundle ID",
      });
      return;
    }

    try {
      setActionLoading({ open: true });
      setMessage({ type: "", text: "" });

      await axios.post("/api/devices/deeplink", {
        deviceId: selectedDevice,
        ...deepLinkForm,
      });

      setMessage({ type: "success", text: "Deep link opened successfully!" });
      setDeepLinkForm({
        url: "",
        bundleId: "",
        scheme: "",
        path: "",
        query: "",
      });
    } catch (error) {
      console.error("Error opening deep link:", error);
      setMessage({
        type: "error",
        text:
          "Error opening deep link: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ open: false });
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
          <h1 className="text-3xl font-bold text-gray-900">Deep Links</h1>
          <p className="text-gray-600 mt-2">
            Test deep link functionality on your simulator devices
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
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Device Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Select Target Device
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device
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
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">
              {devices.find((d) => d.id === selectedDevice)?.name ||
                "No device selected"}
            </span>
          </div>
        </div>
      </div>

      {/* Deep Link Form */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Deep Link Configuration
        </h2>
        <div className="space-y-4">
          {/* URL Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL (Universal Links)
            </label>
            <input
              type="url"
              value={deepLinkForm.url}
              onChange={(e) =>
                setDeepLinkForm({ ...deepLinkForm, url: e.target.value })
              }
              className="input-field"
              placeholder="https://example.com/path?param=value"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use for testing universal links and web URLs
            </p>
          </div>

          {/* Custom Scheme Method */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bundle ID
              </label>
              <input
                type="text"
                value={deepLinkForm.bundleId}
                onChange={(e) =>
                  setDeepLinkForm({ ...deepLinkForm, bundleId: e.target.value })
                }
                className="input-field"
                placeholder="com.example.app"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Scheme
              </label>
              <input
                type="text"
                value={deepLinkForm.scheme}
                onChange={(e) =>
                  setDeepLinkForm({ ...deepLinkForm, scheme: e.target.value })
                }
                className="input-field"
                placeholder="myapp://"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Path
              </label>
              <input
                type="text"
                value={deepLinkForm.path}
                onChange={(e) =>
                  setDeepLinkForm({ ...deepLinkForm, path: e.target.value })
                }
                className="input-field"
                placeholder="/screen/action"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Query Parameters (JSON)
            </label>
            <input
              type="text"
              value={deepLinkForm.query}
              onChange={(e) =>
                setDeepLinkForm({ ...deepLinkForm, query: e.target.value })
              }
              className="input-field"
              placeholder='{"key": "value", "id": "123"}'
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional parameters to pass with the deep link
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleOpenDeepLink}
            disabled={
              !selectedDevice ||
              (!deepLinkForm.url && !deepLinkForm.bundleId) ||
              actionLoading.open
            }
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading.open ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Opening...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Open Deep Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Deep Link Templates */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() =>
              setDeepLinkForm({
                ...deepLinkForm,
                url: "https://maps.apple.com/?q=Apple+Park",
                bundleId: "",
                scheme: "",
                path: "",
                query: "",
              })
            }
            className="btn-secondary text-sm"
          >
            <Globe className="h-4 w-4 mr-2" />
            Apple Maps
          </button>
          <button
            onClick={() =>
              setDeepLinkForm({
                ...deepLinkForm,
                url: "",
                bundleId: "com.apple.MobileSMS",
                scheme: "sms://",
                path: "",
                query: '{"body": "Hello from simulator!"}',
              })
            }
            className="btn-secondary text-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Messages App
          </button>
          <button
            onClick={() =>
              setDeepLinkForm({
                ...deepLinkForm,
                url: "",
                bundleId: "com.apple.camera",
                scheme: "camera://",
                path: "",
                query: "",
              })
            }
            className="btn-secondary text-sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Camera App
          </button>
          <button
            onClick={() =>
              setDeepLinkForm({
                ...deepLinkForm,
                url: "https://www.apple.com",
                bundleId: "",
                scheme: "",
                path: "",
                query: "",
              })
            }
            className="btn-secondary text-sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Apple Website
          </button>
          <button
            onClick={() =>
              setDeepLinkForm({
                ...deepLinkForm,
                url: "https://developer.apple.com",
                bundleId: "",
                scheme: "",
                path: "",
                query: "",
              })
            }
            className="btn-secondary text-sm"
          >
            <Globe className="h-4 w-4 mr-2" />
            Developer Site
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Deep Link Testing Guide
        </h3>
        <div className="text-gray-600 space-y-3">
          <p>Test deep link functionality on your iOS Simulator devices:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Universal Links:</strong> Use full URLs to test web-to-app
              linking
            </li>
            <li>
              <strong>Custom Schemes:</strong> Test app-specific URL schemes
            </li>
            <li>
              <strong>Bundle ID:</strong> Target specific applications
            </li>
            <li>
              <strong>Path & Query:</strong> Navigate to specific app screens
              with parameters
            </li>
          </ul>
          <p>
            <strong>Note:</strong> Make sure your device is booted and the
            target app is installed to test deep link functionality properly.
          </p>
          <p>
            <strong>iOS Simulator Limitations:</strong> Some URL schemes (like
            prefs://) are restricted in the simulator. Universal links
            (https://) and basic app schemes work best.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeepLinks;
