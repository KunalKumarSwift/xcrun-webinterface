import React, { useState, useEffect, useCallback } from "react";
import {
  Play,
  Square,
  Plus,
  Trash2,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import axios from "axios";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [runtimes, setRuntimes] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    deviceTypeId: "",
    runtimeId: "",
  });

  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [devicesRes, runtimesRes, deviceTypesRes] = await Promise.all([
        axios.get("/api/devices"),
        axios.get("/api/runtimes"),
        axios.get("/api/devicetypes"),
      ]);

      setDevices(parseDevices(devicesRes.data.data));
      setRuntimes(parseRuntimes(runtimesRes.data.data));
      setDeviceTypes(parseDeviceTypes(deviceTypesRes.data.data));
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const parseRuntimes = (data) => {
    const lines = data.split("\n");
    const runtimeList = [];

    lines.forEach((line) => {
      if (line.includes("(") && line.includes(")")) {
        const match = line.match(/(.+) \((.+)\)/);
        if (match) {
          runtimeList.push({
            name: match[1].trim(),
            id: match[2].trim(),
          });
        }
      }
    });

    return runtimeList;
  };

  const parseDeviceTypes = (data) => {
    const lines = data.split("\n");
    const deviceTypeList = [];

    lines.forEach((line) => {
      if (line.includes("(") && line.includes(")")) {
        const match = line.match(/(.+) \((.+)\)/);
        if (match) {
          deviceTypeList.push({
            name: match[1].trim(),
            id: match[2].trim(),
          });
        }
      }
    });

    return deviceTypeList;
  };

  const handleCreateDevice = async () => {
    try {
      setActionLoading({ create: true });
      await axios.post("/api/devices/create", createForm);
      setShowCreateModal(false);
      setCreateForm({ name: "", deviceTypeId: "", runtimeId: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating device:", error);
      alert(
        "Error creating device: " + error.response?.data?.error || error.message
      );
    } finally {
      setActionLoading({ create: false });
    }
  };

  const handleDeviceAction = async (action, deviceId) => {
    try {
      setActionLoading({ [action]: deviceId });

      switch (action) {
        case "boot":
          await axios.post("/api/devices/boot", { deviceId });
          break;
        case "shutdown":
          await axios.post("/api/devices/shutdown", { deviceId });
          break;
        case "delete":
          if (window.confirm("Are you sure you want to delete this device?")) {
            await axios.delete(`/api/devices/${deviceId}`);
          }
          break;
        case "reset":
          if (
            window.confirm(
              "Are you sure you want to reset this device? This will erase all content."
            )
          ) {
            await axios.post("/api/devices/reset", { deviceId });
          }
          break;
        case "open":
          await axios.post("/api/devices/open", { deviceId });
          break;
        default:
          console.warn(`Unknown action: ${action}`);
          break;
      }

      fetchData();
    } catch (error) {
      console.error(`Error ${action} device:`, error);
      alert(
        `Error ${action} device: ` + error.response?.data?.error ||
          error.message
      );
    } finally {
      setActionLoading({ [action]: false });
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
            Device Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your iOS Simulator devices
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Device
          </button>
          <button
            onClick={fetchData}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Device Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Devices
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {devices.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Play className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Running
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {devices.filter((d) => d.isBooted).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
              <Square className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Shutdown
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {devices.filter((d) => !d.isBooted).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Available Devices
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Device Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {devices.map((device) => (
                <tr
                  key={device.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {device.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300 font-mono">
                      {device.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        device.isBooted
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!device.isBooted ? (
                        <button
                          onClick={() => handleDeviceAction("boot", device.id)}
                          disabled={actionLoading.boot === device.id}
                          className="btn-primary text-xs py-1 px-2"
                        >
                          {actionLoading.boot === device.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Boot
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleDeviceAction("shutdown", device.id)
                          }
                          disabled={actionLoading.shutdown === device.id}
                          className="btn-secondary text-xs py-1 px-2"
                        >
                          {actionLoading.shutdown === device.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-800"></div>
                          ) : (
                            <>
                              <Square className="h-3 w-3 mr-1" />
                              Shutdown
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => handleDeviceAction("open", device.id)}
                        disabled={actionLoading.open === device.id}
                        className="btn-secondary text-xs py-1 px-2"
                      >
                        Open
                      </button>

                      <button
                        onClick={() => handleDeviceAction("reset", device.id)}
                        disabled={actionLoading.reset === device.id}
                        className="btn-secondary text-xs py-1 px-2"
                      >
                        Reset
                      </button>

                      <button
                        onClick={() => handleDeviceAction("delete", device.id)}
                        disabled={actionLoading.delete === device.id}
                        className="btn-danger text-xs py-1 px-2"
                      >
                        {actionLoading.delete === device.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Device Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Create New Device
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Device Name
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                    placeholder="e.g., iPhone 15 Pro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Device Type
                  </label>
                  <select
                    value={createForm.deviceTypeId}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        deviceTypeId: e.target.value,
                      })
                    }
                    className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  >
                    <option value="">Select Device Type</option>
                    {deviceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Runtime
                  </label>
                  <select
                    value={createForm.runtimeId}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        runtimeId: e.target.value,
                      })
                    }
                    className="input-field dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                  >
                    <option value="">Select Runtime</option>
                    {runtimes.map((runtime) => (
                      <option key={runtime.id} value={runtime.id}>
                        {runtime.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDevice}
                  disabled={
                    !createForm.name ||
                    !createForm.deviceTypeId ||
                    !createForm.runtimeId ||
                    actionLoading.create
                  }
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading.create ? "Creating..." : "Create Device"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
