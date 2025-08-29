import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Smartphone,
  Clock,
  Settings,
  Grid,
  Bell,
  ExternalLink,
  Video,
  Image,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";

const Navigation = () => {
  const [openSidebarSubmenu, setOpenSidebarSubmenu] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // Load dark mode preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode and persist
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", next);
      return next;
    });
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Devices", href: "/devices", icon: Smartphone },
    { name: "Runtimes", href: "/runtimes", icon: Clock },
    { name: "Device Types", href: "/device-types", icon: Grid },
    {
      name: "Apps",
      icon: Settings,
      submenu: [
        { name: "App Management", href: "/apps", icon: Settings },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Deep Links", href: "/deeplinks", icon: ExternalLink },
        { name: "Media", href: "/media", icon: Image },
        { name: "Recording", href: "/recording", icon: Video },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-30">
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800 justify-between">
        <div className="flex items-center">
          <Smartphone className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            xcrun Simctl
          </span>
        </div>
        <button
          onClick={toggleDarkMode}
          className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-2 space-y-2">
        {navigation.map((item, idx) => {
          if (!item.submenu) {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-300"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          } else {
            // Sidebar submenu
            const isOpen = openSidebarSubmenu === idx;
            return (
              <div key={item.name}>
                <button
                  onClick={() => setOpenSidebarSubmenu(isOpen ? null : idx)}
                  className={`flex items-center w-full px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 focus:outline-none ${
                    isOpen
                      ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-300"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  {isOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                            isActive(sub.href)
                              ? "bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200"
                              : "text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-300"
                          }`}
                        >
                          <SubIcon className="h-4 w-4 mr-2" />
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
        })}
      </nav>
    </aside>
  );
};

export default Navigation;
