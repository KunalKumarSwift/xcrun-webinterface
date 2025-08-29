import React, { useState, useEffect, useCallback } from "react";
import {
  Video,
  Play,
  Square,
  Download,
  Trash2,
  RefreshCw,
  Smartphone,
  Camera,
  FileVideo,
  XCircle,
} from "lucide-react";
import axios from "axios";

const Recording = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [recordings, setRecordings] = useState([]);
  const [recordingForm, setRecordingForm] = useState({
    quality: "high",
    duration: "30",
    outputPath: "",
    includeAudio: true,
    showTouches: true,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState(null);
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

  const handleStartRecording = async () => {
    if (!selectedDevice) {
      setMessage({
        type: "error",
        text: "Please select a device first",
      });
      return;
    }

    try {
      setActionLoading({ start: true });
      setMessage({ type: "", text: "" });

      const response = await axios.post("/api/devices/recording/start", {
        deviceId: selectedDevice,
        ...recordingForm,
      });

      setIsRecording(true);
      setCurrentRecording(response.data.data);
      setMessage({ type: "success", text: "Recording started successfully!" });
    } catch (error) {
      console.error("Error starting recording:", error);
      setMessage({
        type: "error",
        text:
          "Error starting recording: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ start: false });
    }
  };

  const handleStopRecording = async () => {
    if (!currentRecording) return;

    try {
      setActionLoading({ stop: true });
      setMessage({ type: "", text: "" });

      await axios.post("/api/devices/recording/stop", {
        deviceId: selectedDevice,
        recordingId: currentRecording.id,
      });

      setIsRecording(false);
      setCurrentRecording(null);
      setMessage({ type: "success", text: "Recording stopped successfully!" });

      // Refresh recordings list
      fetchRecordings();
    } catch (error) {
      console.error("Error stopping recording:", error);
      setMessage({
        type: "error",
        text:
          "Error stopping recording: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ stop: false });
    }
  };

  const handleDeleteRecording = async (recordingId) => {
    try {
      setActionLoading({ delete: recordingId });
      setMessage({ type: "", text: "" });

      await axios.delete(
        `/api/devices/recording/${selectedDevice}/${recordingId}`
      );

      setMessage({ type: "success", text: "Recording deleted successfully!" });

      // Refresh recordings list
      fetchRecordings();
    } catch (error) {
      console.error("Error deleting recording:", error);
      setMessage({
        type: "error",
        text:
          "Error deleting recording: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ delete: false });
    }
  };

  const fetchRecordings = async () => {
    if (!selectedDevice) return;

    try {
      const response = await axios.get(
        `/api/devices/recording/${selectedDevice}`
      );
      setRecordings(response.data.data || []);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    }
  };

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Screen Recording
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Record videos of your simulator screens for demos and testing
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
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button
              onClick={clearMessage}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Device Selection */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Select Target Device
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Device
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => {
                setSelectedDevice(e.target.value);
                if (e.target.value) {
                  fetchRecordings();
                }
              }}
              className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
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
            <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {devices.find((d) => d.id === selectedDevice)?.name ||
                "No device selected"}
            </span>
          </div>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recording Controls
        </h2>

        {!isRecording ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quality
                </label>
                <select
                  value={recordingForm.quality}
                  onChange={(e) =>
                    setRecordingForm({
                      ...recordingForm,
                      quality: e.target.value,
                    })
                  }
                  className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                >
                  <option value="low">Low (480p)</option>
                  <option value="medium">Medium (720p)</option>
                  <option value="high">High (1080p)</option>
                  <option value="ultra">Ultra (4K)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  value={recordingForm.duration}
                  onChange={(e) =>
                    setRecordingForm({
                      ...recordingForm,
                      duration: e.target.value,
                    })
                  }
                  className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  placeholder="30"
                  min="5"
                  max="300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Output Path
                </label>
                <input
                  type="text"
                  value={recordingForm.outputPath}
                  onChange={(e) =>
                    setRecordingForm({
                      ...recordingForm,
                      outputPath: e.target.value,
                    })
                  }
                  className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  placeholder="~/Desktop/recording.mp4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeAudio"
                  checked={recordingForm.includeAudio}
                  onChange={(e) =>
                    setRecordingForm({
                      ...recordingForm,
                      includeAudio: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <label
                  htmlFor="includeAudio"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Include Audio
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showTouches"
                  checked={recordingForm.showTouches}
                  onChange={(e) =>
                    setRecordingForm({
                      ...recordingForm,
                      showTouches: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700 rounded"
                />
                <label
                  htmlFor="showTouches"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Show Touch Indicators
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleStartRecording}
                disabled={!selectedDevice || actionLoading.start}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading.start ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Recording
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                Recording in Progress...
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Recording device:{" "}
              {devices.find((d) => d.id === selectedDevice)?.name}
            </p>
            <button
              onClick={handleStopRecording}
              disabled={actionLoading.stop}
              className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading.stop ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Stopping...
                </>
              ) : (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Recordings Library */}
      {selectedDevice && (
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recordings Library
            </h2>
            <button onClick={fetchRecordings} className="btn-secondary text-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>

          {recordings.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileVideo className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
              <p>No recordings found on this device</p>
              <p className="text-sm">
                Start recording to create your first video
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <FileVideo className="h-5 w-5 text-purple-600 dark:text-purple-300 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {recording.name || `Recording ${recording.id}`}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleDeleteRecording(recording.id)}
                        disabled={actionLoading.delete === recording.id}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete recording"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Quality:</span>
                      <span className="capitalize">{recording.quality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{formatDuration(recording.duration || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{recording.size || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{recording.date || "Unknown"}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      className="btn-secondary text-xs py-1 px-2 flex-1"
                      title="Download recording"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </button>
                    <button
                      className="btn-primary text-xs py-1 px-2 flex-1"
                      title="Play recording"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Recording Templates */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Recording Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() =>
              setRecordingForm({
                ...recordingForm,
                quality: "high",
                duration: "30",
                includeAudio: true,
                showTouches: true,
              })
            }
            className="btn-secondary text-sm"
          >
            <Camera className="h-4 w-4 mr-2" />
            Demo Recording
          </button>
          <button
            onClick={() =>
              setRecordingForm({
                ...recordingForm,
                quality: "medium",
                duration: "60",
                includeAudio: false,
                showTouches: true,
              })
            }
            className="btn-secondary text-sm"
          >
            <Camera className="h-4 w-4 mr-2" />
            Tutorial Video
          </button>
          <button
            onClick={() =>
              setRecordingForm({
                ...recordingForm,
                quality: "ultra",
                duration: "120",
                includeAudio: true,
                showTouches: false,
              })
            }
            className="btn-secondary text-sm"
          >
            <Camera className="h-4 w-4 mr-2" />
            High Quality Demo
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Screen Recording Guide
        </h3>
        <div className="text-gray-600 dark:text-gray-300 space-y-3">
          <p>Record high-quality videos of your iOS Simulator screens:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Quality:</strong> Choose from low (480p) to ultra (4K)
              resolution
            </li>
            <li>
              <strong>Duration:</strong> Set maximum recording time (5-300
              seconds)
            </li>
            <li>
              <strong>Audio:</strong> Include system audio in your recordings
            </li>
            <li>
              <strong>Touch Indicators:</strong> Show visual feedback for touch
              interactions
            </li>
            <li>
              <strong>Output Path:</strong> Specify where to save the recording
              file
            </li>
          </ul>
          <p>
            <strong>Note:</strong> Make sure your device is booted and you have
            sufficient disk space for high-quality recordings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recording;
