import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import { ConfigProvider, theme } from "antd";
import Trips from "./pages/Trips";
import Statistics from "./pages/Statistic";

import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotificationsPage from "./pages/Notifications/Notifications";
import { useEffect } from "react";
import { enums } from "./enums";
import Admin from "./pages/Admin/Admin";
import AdminAuthPage from "./pages/Admin/AdminAuthPage";

const { darkAlgorithm } = theme;

function App() {
  useEffect(() => {
    const theme = localStorage.getItem(enums.THEME);

    if (theme === "light") {
      document.body.style.filter = "invert()";
    } else {
      document.body.style.filter = "none";
    }
  }, []);

  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/statistic" element={<Statistics />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="/admin-panel" element={<Admin />} />
          <Route path="/admin-panel/login" element={<AdminAuthPage />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
