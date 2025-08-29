import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Smartphone,
  Folder,
  FileImage,
  FileVideo,
  FileAudio,
  XCircle,
} from "lucide-react";
import axios from "axios";

const Media = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    mediaType: "photo",
    filePath: "",
    album: "Camera Roll",
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isDragActive, setIsDragActive] = useState(false);

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

  const handleUploadMedia = async () => {
    if (!selectedDevice || !uploadForm.filePath) {
      setMessage({
        type: "error",
        text: "Please select a device and provide a file path",
      });
      return;
    }

    try {
      setActionLoading({ upload: true });
      setMessage({ type: "", text: "" });

      await axios.post("/api/devices/media/upload", {
        deviceId: selectedDevice,
        ...uploadForm,
      });

      setMessage({ type: "success", text: "Media uploaded successfully!" });
      setUploadForm({
        mediaType: "photo",
        filePath: "",
        album: "Camera Roll",
      });

      // Refresh media list
      if (selectedDevice) {
        fetchMediaFiles();
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      setMessage({
        type: "error",
        text:
          "Error uploading media: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ upload: false });
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!selectedDevice) {
      setMessage({
        type: "error",
        text: "Please select a device first",
      });
      return;
    }

    try {
      setActionLoading({ delete: mediaId });
      setMessage({ type: "", text: "" });

      await axios.delete(`/api/devices/media/${selectedDevice}/${mediaId}`);

      setMessage({ type: "success", text: "Media deleted successfully!" });

      // Refresh media list
      fetchMediaFiles();
    } catch (error) {
      console.error("Error deleting media:", error);
      setMessage({
        type: "error",
        text:
          "Error deleting media: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setActionLoading({ delete: false });
    }
  };

  const fetchMediaFiles = async () => {
    if (!selectedDevice) return;

    try {
      const response = await axios.get(`/api/devices/media/${selectedDevice}`);
      setMediaFiles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching media files:", error);
    }
  };

  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case "photo":
        return <FileImage className="h-5 w-5 text-blue-600" />;
      case "video":
        return <FileVideo className="h-5 w-5 text-purple-600" />;
      case "audio":
        return <FileAudio className="h-5 w-5 text-green-600" />;
      default:
        return <FileImage className="h-5 w-5 text-gray-600" />;
    }
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
            Media Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage photos, videos, and other media on your simulator devices
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
                  fetchMediaFiles();
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

      {/* Upload Media */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Upload Media
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Media Type
              </label>
              <select
                value={uploadForm.mediaType}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, mediaType: e.target.value })
                }
                className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Album
              </label>
              <input
                type="text"
                value={uploadForm.album}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, album: e.target.value })
                }
                className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                placeholder="Camera Roll"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File Path
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-colors duration-200 cursor-pointer ${
                  isDragActive
                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragActive(false);
                  const file = e.dataTransfer.files[0];
                  if (file && file.path) {
                    setUploadForm((f) => ({ ...f, filePath: file.path }));
                  }
                }}
                onClick={() => {
                  document.getElementById("media-file-input").click();
                }}
              >
                <input
                  id="media-file-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.path) {
                      setUploadForm((f) => ({ ...f, filePath: file.path }));
                    }
                  }}
                />
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  Drag & drop your file here, or click to select
                </p>
                {uploadForm.filePath && (
                  <p className="mt-2 text-xs text-primary-600 dark:text-primary-300 break-all text-center">
                    Selected: {uploadForm.filePath}
                  </p>
                )}
              </div>
              <input
                type="text"
                value={uploadForm.filePath}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, filePath: e.target.value }))
                }
                className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 mt-2"
                placeholder="/path/to/media/file"
              />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleUploadMedia}
            disabled={
              !selectedDevice || !uploadForm.filePath || actionLoading.upload
            }
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading.upload ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Media
              </>
            )}
          </button>
        </div>
      </div>

      {/* Media Library */}
      {selectedDevice && (
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Media Library
            </h2>
            <button onClick={fetchMediaFiles} className="btn-secondary text-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>

          {mediaFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
              <p>No media files found on this device</p>
              <p className="text-sm">Upload some media to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaFiles.map((media) => (
                <div
                  key={media.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {getMediaIcon(media.type)}
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {media.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteMedia(media.id)}
                      disabled={actionLoading.delete === media.id}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="capitalize">{media.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Album:</span>
                      <span>{media.album}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{media.size || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{media.date || "Unknown"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Upload Templates */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Upload Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() =>
              setUploadForm({
                ...uploadForm,
                mediaType: "photo",
                album: "Camera Roll",
                filePath: "~/Desktop/sample_photo.jpg",
              })
            }
            className="btn-secondary text-sm"
          >
            <FileImage className="h-4 w-4 mr-2" />
            Sample Photo
          </button>
          <button
            onClick={() =>
              setUploadForm({
                ...uploadForm,
                mediaType: "video",
                album: "Videos",
                filePath: "~/Desktop/sample_video.mp4",
              })
            }
            className="btn-secondary text-sm"
          >
            <FileVideo className="h-4 w-4 mr-2" />
            Sample Video
          </button>
          <button
            onClick={() =>
              setUploadForm({
                ...uploadForm,
                mediaType: "audio",
                album: "Music",
                filePath: "~/Desktop/sample_audio.m4a",
              })
            }
            className="btn-secondary text-sm"
          >
            <FileAudio className="h-4 w-4 mr-2" />
            Sample Audio
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Media Management Guide
        </h3>
        <div className="text-gray-600 dark:text-gray-300 space-y-3">
          <p>Manage media files on your iOS Simulator devices:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Photos:</strong> Upload images to Camera Roll or custom
              albums
            </li>
            <li>
              <strong>Videos:</strong> Add video files for testing video
              playback
            </li>
            <li>
              <strong>Audio:</strong> Upload music and audio files
            </li>
            <li>
              <strong>File Paths:</strong> Use absolute paths to media files on
              your Mac
            </li>
            <li>
              <strong>Albums:</strong> Organize media into custom albums
            </li>
          </ul>
          <p>
            <strong>Note:</strong> Make sure your device is booted and provide
            valid file paths to existing media files on your system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Media;
