import React, { useState, useEffect, useCallback } from "react";
import { Clock, RefreshCw } from "lucide-react";
import axios from "axios";

const Runtimes = () => {
  const [runtimes, setRuntimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRuntimes();
  }, []);

  const fetchRuntimes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/runtimes");
      setRuntimes(parseRuntimes(response.data.data));
    } catch (error) {
      console.error("Error fetching runtimes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">iOS Runtimes</h1>
          <p className="text-gray-600 mt-2">
            Available iOS Simulator runtimes for device creation
          </p>
        </div>
        <button
          onClick={fetchRuntimes}
          className="btn-secondary flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Runtime Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Runtimes
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {runtimes.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Latest Version
              </p>
              <p className="text-lg font-bold text-gray-900">
                {runtimes.length > 0 ? runtimes[0].name : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Runtimes Table */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available Runtimes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Runtime Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Runtime ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  iOS Version
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {runtimes.map((runtime, index) => (
                <tr key={runtime.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {runtime.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">
                      {runtime.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {runtime.name.includes("iOS")
                        ? runtime.name.split(" ")[1]
                        : "N/A"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          About iOS Runtimes
        </h3>
        <div className="text-gray-600 space-y-3">
          <p>
            iOS Runtimes are the core system images that define the iOS version
            and capabilities available for your simulator devices. Each runtime
            includes:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>iOS system files and frameworks</li>
            <li>Built-in applications (Settings, Safari, etc.)</li>
            <li>System-level APIs and capabilities</li>
            <li>Device-specific optimizations</li>
          </ul>
          <p>
            When creating a new simulator device, you'll need to select both a
            device type (hardware configuration) and a runtime (iOS version).
            The runtime determines which iOS features and APIs are available to
            your apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Runtimes;
