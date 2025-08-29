import React, { useState, useEffect, useCallback } from "react";
import { Settings, RefreshCw, Smartphone, Tablet } from "lucide-react";
import axios from "axios";

const DeviceTypes = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const fetchDeviceTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/devicetypes");
      setDeviceTypes(parseDeviceTypes(response.data.data));
    } catch (error) {
      console.error("Error fetching device types:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const getDeviceCategory = (name) => {
    if (name.includes("iPhone")) return "iPhone";
    if (name.includes("iPad")) return "iPad";
    if (name.includes("Apple TV")) return "Apple TV";
    if (name.includes("Apple Watch")) return "Apple Watch";
    return "Other";
  };

  const getDeviceIcon = (category) => {
    switch (category) {
      case "iPhone":
        return <Smartphone className="h-5 w-5 text-blue-600" />;
      case "iPad":
        return <Tablet className="h-5 w-5 text-purple-600" />;
      case "Apple TV":
        return <div className="h-5 w-5 bg-gray-600 rounded"></div>;
      case "Apple Watch":
        return <div className="h-5 w-5 bg-gray-600 rounded-full"></div>;
      default:
        return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const categories = ["iPhone", "iPad", "Apple TV", "Apple Watch", "Other"];
  const groupedDevices = categories
    .map((category) => ({
      category,
      devices: deviceTypes.filter(
        (dt) => getDeviceCategory(dt.name) === category
      ),
    }))
    .filter((group) => group.devices.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Device Types
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Available iOS Simulator device configurations
          </p>
        </div>
        <button
          onClick={fetchDeviceTypes}
          className="btn-secondary flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Device Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                iPhone
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {
                  deviceTypes.filter(
                    (dt) => getDeviceCategory(dt.name) === "iPhone"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Tablet className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                iPad
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {
                  deviceTypes.filter(
                    (dt) => getDeviceCategory(dt.name) === "iPad"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="h-6 w-6 bg-gray-600 dark:bg-gray-400 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Apple TV
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {
                  deviceTypes.filter(
                    (dt) => getDeviceCategory(dt.name) === "Apple TV"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="h-6 w-6 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Apple Watch
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {
                  deviceTypes.filter(
                    (dt) => getDeviceCategory(dt.name) === "Apple Watch"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Device Types */}
      {groupedDevices.map((group) => (
        <div
          key={group.category}
          className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            {getDeviceIcon(group.category)}
            <span className="ml-2">{group.category} Devices</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Device Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Device Type ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Screen Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resolution
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {group.devices.map((deviceType) => (
                  <tr
                    key={deviceType.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {deviceType.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300 font-mono">
                        {deviceType.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {getScreenSize(deviceType.name)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {getResolution(deviceType.name)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Information */}
      <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          About Device Types
        </h3>
        <div className="text-gray-600 dark:text-gray-300 space-y-3">
          <p>
            Device Types define the hardware configuration and capabilities of
            your simulator devices. Each device type includes:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Screen dimensions and resolution</li>
            <li>Hardware capabilities and sensors</li>
            <li>Performance characteristics</li>
            <li>Device-specific features</li>
          </ul>
          <p>
            When creating a new simulator device, you'll need to select both a
            device type (hardware configuration) and a runtime (iOS version).
            The device type determines the physical characteristics and
            capabilities available to your apps.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper functions to extract device information
const getScreenSize = (name) => {
  if (name.includes("iPhone")) {
    if (name.includes("Pro Max") || name.includes("Plus")) return '6.7"';
    if (name.includes("Pro")) return '6.1"';
    if (name.includes("mini")) return '5.4"';
    if (name.includes("SE")) return '4.7"';
    return '6.1"';
  }
  if (name.includes("iPad")) {
    if (name.includes("Pro 12.9")) return '12.9"';
    if (name.includes("Pro 11")) return '11"';
    if (name.includes("Air")) return '10.9"';
    if (name.includes("mini")) return '8.3"';
    return '10.2"';
  }
  return "N/A";
};

const getResolution = (name) => {
  if (name.includes("iPhone")) {
    if (name.includes("Pro Max") || name.includes("Plus")) return "2796 x 1290";
    if (name.includes("Pro")) return "2556 x 1179";
    if (name.includes("mini")) return "2340 x 1080";
    if (name.includes("SE")) return "1334 x 750";
    return "2532 x 1170";
  }
  if (name.includes("iPad")) {
    if (name.includes("Pro 12.9")) return "2732 x 2048";
    if (name.includes("Pro 11")) return "2388 x 1668";
    if (name.includes("Air")) return "2360 x 1640";
    if (name.includes("mini")) return "2266 x 1488";
    return "2160 x 1620";
  }
  return "N/A";
};

export default DeviceTypes;
