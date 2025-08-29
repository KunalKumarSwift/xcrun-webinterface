import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Runtimes from "./pages/Runtimes";
import DeviceTypes from "./pages/DeviceTypes";
import Apps from "./pages/Apps";
import Notifications from "./pages/Notifications";
import DeepLinks from "./pages/DeepLinks";
import Media from "./pages/Media";
import Recording from "./pages/Recording";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
        <Navigation />
        <main className="flex-1 ml-64 px-8 py-8 text-gray-900 dark:text-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/runtimes" element={<Runtimes />} />
            <Route path="/device-types" element={<DeviceTypes />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/deeplinks" element={<DeepLinks />} />
            <Route path="/media" element={<Media />} />
            <Route path="/recording" element={<Recording />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
