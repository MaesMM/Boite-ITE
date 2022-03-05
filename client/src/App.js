import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Rooms from "./pages/Rooms/Rooms";
import Informations from "./pages/Informations/Informations";
import Room from "./pages/Room/Room";
import CreateRoom from "./pages/CreateRoom/CreateRoom";
import CreateBox from "./pages/CreateDevice/CreateDevice";
import Devices from "./pages/Devices/Devices";
import Device from "./pages/Device/Device";
import Settings from "./pages/Settings/Settings";
import CreateBuilding from "./pages/CreateBuilding/CreateBuilding";
import { useState } from "react";
import refreshContext from "./contexts/refreshContext";
import notificationContext from "./contexts/notificationContext";
import SnackNotification from "./components/shared/SnackNotification/SnackNotification";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    text: "",
  });

  return (
    <div className="App">
      <notificationContext.Provider value={{ notification, setNotification }}>
        <refreshContext.Provider value={{ refresh, setRefresh }}>
          <Router>
            <Navbar />

            <div className="page">
              <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/devices" element={<Devices />} />
                <Route
                  exact
                  path="/devices/:uuid/configure"
                  element={<CreateBox />}
                />
                <Route exact path="/devices/:uuid" element={<Device />} />
                <Route
                  exact
                  path="/buildings/create"
                  element={<CreateBuilding />}
                />
                <Route exact path="/rooms" element={<Rooms />} />
                <Route
                  exact
                  path="/buildings/:uuid/rooms/create"
                  element={<CreateRoom />}
                />
                <Route exact path="/rooms/:uuid" element={<Room />} />
                <Route exact path="/informations" element={<Informations />} />
                <Route exact path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </Router>
        </refreshContext.Provider>
        <SnackNotification />
      </notificationContext.Provider>
    </div>
  );
}

export default App;
