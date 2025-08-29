import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Send,
  RefreshCw,
  Smartphone,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";

const Notifications = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    body: "",
    badge: "",
    sound: "default",
    category: "",
    userInfo: "",
    bundleId: "",
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

  const handleSendNotification = async () => {
    if (
      !selectedDevice ||
      !notificationForm.title ||
      !notificationForm.body ||
      !notificationForm.bundleId
    ) {
      setMessage({
        type: "error",
        text: "Please select a device and provide notification title, body, and bundle ID",
      });
      return;
    }

    try {
      setActionLoading({ send: true });
      setMessage({ type: "", text: "" });

      await axios.post("/api/devices/notification", {
        deviceId: selectedDevice,
        ...notificationForm,
      });

      setMessage({ type: "success", text: "Notification sent successfully!" });
      setNotificationForm({
        title: "",
        body: "",
        badge: "",
        sound: "default",
        category: "",
        userInfo: "",
        bundleId: "",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      setMessage({
        type: "error",
        text:
          "Error sending notification: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ send: false });
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
          <h1 className="text-3xl font-bold text-gray-900">
            Push Notifications
          </h1>
          <p className="text-gray-600 mt-2">
            Send push notifications to your simulator devices
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

      {/* Notification Form */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Notification Details
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={notificationForm.title}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    title: e.target.value,
                  })
                }
                className="input-field"
                placeholder="Notification title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bundle ID *
              </label>
              <input
                type="text"
                value={notificationForm.bundleId}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    bundleId: e.target.value,
                  })
                }
                className="input-field"
                placeholder="com.example.app"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge Number
              </label>
              <input
                type="number"
                value={notificationForm.badge}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    badge: e.target.value,
                  })
                }
                className="input-field"
                placeholder="Badge count"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sound
              </label>
              <select
                value={notificationForm.sound}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    sound: e.target.value,
                  })
                }
                className="input-field"
              >
                <option value="default">Default</option>
                <option value="none">None</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body *
            </label>
            <textarea
              value={notificationForm.body}
              onChange={(e) =>
                setNotificationForm({
                  ...notificationForm,
                  body: e.target.value,
                })
              }
              className="input-field"
              rows={3}
              placeholder="Notification message"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sound
              </label>
              <select
                value={notificationForm.sound}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    sound: e.target.value,
                  })
                }
                className="input-field"
              >
                <option value="default">Default</option>
                <option value="none">None</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={notificationForm.category}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    category: e.target.value,
                  })
                }
                className="input-field"
                placeholder="Notification category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Info (JSON)
              </label>
              <input
                type="text"
                value={notificationForm.userInfo}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    userInfo: e.target.value,
                  })
                }
                className="input-field"
                placeholder='{"key": "value"}'
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSendNotification}
            disabled={
              !selectedDevice ||
              !notificationForm.title ||
              !notificationForm.body ||
              !notificationForm.bundleId ||
              actionLoading.send
            }
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading.send ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Notification Templates */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() =>
              setNotificationForm({
                ...notificationForm,
                title: "Welcome!",
                body: "Welcome to the simulator!",
                category: "greeting",
                bundleId: "com.apple.Preferences",
              })
            }
            className="btn-secondary text-sm"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Welcome Message
          </button>
          <button
            onClick={() =>
              setNotificationForm({
                ...notificationForm,
                title: "Alert!",
                body: "This is an important alert message.",
                category: "alert",
                sound: "default",
                bundleId: "com.apple.MobileSMS",
              })
            }
            className="btn-secondary text-sm"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Alert Message
          </button>
          <button
            onClick={() =>
              setNotificationForm({
                ...notificationForm,
                title: "Success!",
                body: "Operation completed successfully.",
                category: "success",
                badge: "1",
                bundleId: "com.apple.camera",
              })
            }
            className="btn-secondary text-sm"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Success Message
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Push Notification Guide
        </h3>
        <div className="text-gray-600 space-y-3">
          <p>
            Send push notifications to your iOS Simulator devices to test
            notification handling:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Title & Body:</strong> Required fields for the
              notification content
            </li>
            <li>
              <strong>Bundle ID:</strong> Required - specifies which app
              receives the notification
            </li>
            <li>
              <strong>Badge:</strong> Number to display on the app icon
            </li>
            <li>
              <strong>Sound:</strong> Audio feedback when notification arrives
            </li>
            <li>
              <strong>Category:</strong> Group notifications for different
              actions
            </li>
            <li>
              <strong>User Info:</strong> Custom data in JSON format
            </li>
          </ul>
          <p>
            <strong>Note:</strong> Make sure your device is booted and the
            target app is installed to receive notifications properly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
