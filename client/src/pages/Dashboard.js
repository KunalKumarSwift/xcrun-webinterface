import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Clock,
  Settings,
  Play,
  Square,
  Plus,
  Trash2,
  Download,
  Bell,
  ExternalLink,
  Image,
  Video,
} from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    devices: 0,
    runtimes: 0,
    deviceTypes: 0,
    runningDevices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [devicesRes, runtimesRes, deviceTypesRes] = await Promise.all([
        axios.get("/api/devices"),
        axios.get("/api/runtimes"),
        axios.get("/api/devicetypes"),
      ]);

      const deviceCount = (devicesRes.data.data.match(/\(/g) || []).length;
      const runtimeCount = (runtimesRes.data.data.match(/\(/g) || []).length;
      const deviceTypeCount = (deviceTypesRes.data.data.match(/\(/g) || [])
        .length;
      const runningCount = (devicesRes.data.data.match(/Booted/g) || []).length;

      setStats({
        devices: deviceCount,
        runtimes: runtimeCount,
        deviceTypes: deviceTypeCount,
        runningDevices: runningCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Boot Device",
      description: "Start a simulator device",
      icon: Play,
      color: "bg-green-500",
      href: "/devices",
    },
    {
      title: "Shutdown Device",
      description: "Stop a running simulator",
      icon: Square,
      color: "bg-red-500",
      href: "/devices",
    },
    {
      title: "Create Device",
      description: "Add a new simulator device",
      icon: Plus,
      color: "bg-blue-500",
      href: "/devices",
    },
    {
      title: "Install App",
      description: "Install an app on device",
      icon: Download,
      color: "bg-purple-500",
      href: "/apps",
    },
    {
      title: "Send Notification",
      description: "Test push notifications",
      icon: Bell,
      color: "bg-yellow-500",
      href: "/notifications",
    },
    {
      title: "Test Deep Links",
      description: "Test app linking",
      icon: ExternalLink,
      color: "bg-teal-500",
      href: "/deeplinks",
    },
    {
      title: "Upload Media",
      description: "Add photos and videos",
      icon: Image,
      color: "bg-pink-500",
      href: "/media",
    },
    {
      title: "Record Screen",
      description: "Create demo videos",
      icon: Video,
      color: "bg-indigo-500",
      href: "/recording",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          xcrun Simctl Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Manage your iOS Simulator devices, runtimes, and applications through
          a modern web interface. Use the navigation above to access different
          management features.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {stats.devices}
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
                Running Devices
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.runningDevices}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Available Runtimes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.runtimes}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <Settings className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Device Types
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.deviceTypes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-full ${action.color} dark:opacity-80`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {action.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {action.description}
                </p>
                <a
                  href={action.href}
                  className="inline-flex items-center text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 font-medium"
                >
                  Go to {action.title.split(" ")[0]}
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Features Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Device Management
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Create, delete, and manage simulator devices</li>
              <li>• Boot and shutdown devices</li>
              <li>• Reset device content and settings</li>
              <li>• View device status and information</li>
            </ul>
          </div>

          <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              App Management
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Install and uninstall applications</li>
              <li>• Launch and terminate apps</li>
              <li>• Manage app bundles and identifiers</li>
              <li>• Monitor app performance</li>
            </ul>
          </div>

          <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Runtime & Device Types
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• View available iOS runtimes</li>
              <li>• Browse device type configurations</li>
              <li>• Create devices with specific configurations</li>
              <li>• Manage simulator environments</li>
            </ul>
          </div>

          <div className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Advanced Features
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Real-time device monitoring</li>
              <li>• Batch operations support</li>
              <li>• Command history and logging</li>
              <li>• RESTful API endpoints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
